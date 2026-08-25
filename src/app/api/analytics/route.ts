import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import crypto from "crypto";
import { rateLimit, getClientIp } from "~/lib/rate-limit";

function parseDeviceAndBrowser(userAgent: string): {
  device: string;
  os: string;
  browser: string;
} {
  let device = "Desktop";
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
    device = /ipad|tablet/i.test(userAgent) ? "Tablet" : "Mobile";
  }

  let os = "Other";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/linux/i.test(userAgent)) os = "Linux";

  let browser = "Other";
  if (/telegram/i.test(userAgent)) browser = "Telegram In-App";
  else if (/instagram/i.test(userAgent)) browser = "Instagram In-App";
  else if (/fbav|fban/i.test(userAgent)) browser = "Facebook In-App";
  else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/opr|opera/i.test(userAgent)) browser = "Opera";

  return { device, os, browser };
}

function parseReferrer(rawReferrer: string, userAgent: string): string {
  if (/telegram/i.test(userAgent)) return "Telegram In-App";
  if (/instagram/i.test(userAgent)) return "Instagram In-App";
  if (/fbav|fban/i.test(userAgent)) return "Facebook In-App";

  if (!rawReferrer) return "Direct";

  try {
    const host = new URL(rawReferrer).hostname.toLowerCase();
    if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("facebook.com") || host.includes("fb.me")) return "Facebook";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("twitter.com") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("youtube.com")) return "YouTube";
    if (host.includes("voyt.art") || host.includes("localhost")) return "Internal";
    return host.replace(/^www\./, "");
  } catch {
    return rawReferrer.slice(0, 50);
  }
}

function categorizePage(path: string): string {
  if (path === "/" || path === "") return "HOME";
  if (path.startsWith("/art")) return "GALLERY";
  if (path.startsWith("/shop")) return "SHOP";
  if (path.startsWith("/cart")) return "CART";
  if (path.startsWith("/checkout")) return "CHECKOUT";
  if (path.startsWith("/gallery")) return "POSTS";
  return "OTHER";
}

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd")) return true;
  return false;
}

// In-memory geo cache з витісненням найстарішого запису (FIFO) замість повного очищення
const GEO_CACHE_MAX = 3000;
const geoCache = new Map<string, { country: string; city: string | null }>();

function cacheGeo(ip: string, result: { country: string; city: string | null }) {
  if (geoCache.size >= GEO_CACHE_MAX) {
    const oldest = geoCache.keys().next().value;
    if (oldest !== undefined) geoCache.delete(oldest);
  }
  geoCache.set(ip, result);
}

async function resolveGeo(rawIp: string, req: NextRequest): Promise<{ country: string; city: string | null }> {
  // Normalize IP
  let ip = rawIp.trim();
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // 1. Direct Edge / Reverse Proxy Headers (Cloudflare, Vercel, AWS CloudFront, Nginx custom)
  const headerCountry =
    req.headers.get("cf-ipcountry") ??
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cloudfront-viewer-country") ??
    req.headers.get("x-country-code") ??
    req.headers.get("x-geo-country");

  const headerCity =
    req.headers.get("x-vercel-ip-city") ??
    req.headers.get("cf-ipcity") ??
    req.headers.get("cloudfront-viewer-city") ??
    null;

  if (headerCountry && headerCountry !== "XX" && headerCountry !== "T1" && headerCountry.length === 2) {
    return { country: headerCountry.toUpperCase(), city: headerCity };
  }

  // 2. Private/Localhost IPs
  if (isPrivateIp(ip)) {
    return { country: "UA", city: "Localhost" };
  }

  // 3. In-memory cache
  const cached = geoCache.get(ip);
  if (cached) {
    return cached;
  }

  // 4. HTTPS-only provider: ipwho.is (короткий таймаут; HTTP ip-api.com прибрано —
  // приватність IP-адрес користувачів)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as { success?: boolean; country_code?: string; city?: string };
      if (data.success && data.country_code?.length === 2) {
        const result = { country: data.country_code.toUpperCase(), city: data.city ?? null };
        cacheGeo(ip, result);
        return result;
      }
    }
  } catch {
    // Fall through to UNKNOWN
  }

  return { country: "UNKNOWN", city: null };
}

// In-memory TTL-cache для dedup (ключ → timestamp останньої події)
const dedupCache = new Map<string, number>();
const DEDUP_CACHE_MAX = 10000;

function pruneDedupCache() {
  if (dedupCache.size < DEDUP_CACHE_MAX) return;
  const cutoff = Date.now() - 5000;
  for (const [key, ts] of dedupCache) {
    if (ts < cutoff) dedupCache.delete(key);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate-limit: максимум 30 подій за хвилину на IP
    const rl = rateLimit(`analytics:${getClientIp(req.headers)}`, { limit: 30, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      path?: string;
      pageType?: string;
      targetId?: number;
    };
    const { path = "/", pageType: customPageType, targetId } = body;

    // Ignore admin & api routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ignored: true });
    }

    const userAgent = req.headers.get("user-agent") ?? "";
    // Ignore bots & crawlers from corrupting visit metrics
    if (/bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider/i.test(userAgent)) {
      return NextResponse.json({ bot: true });
    }

    const rawReferrer = req.headers.get("referer") ?? "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "127.0.0.1";

    // Accurate Multi-Tier Country & City resolution
    const { country, city } = await resolveGeo(ip, req);

    const { device, os, browser } = parseDeviceAndBrowser(userAgent);
    const referer = parseReferrer(rawReferrer, userAgent);
    const pageType = customPageType ?? categorizePage(path);

    // Auto extract targetId from shop path if not explicitly provided
    let finalTargetId = targetId;
    if (!finalTargetId && path.startsWith("/shop/")) {
      const parsedId = parseInt(path.replace("/shop/", ""), 10);
      if (!isNaN(parsedId)) finalTargetId = parsedId;
    }

    // Anonymized daily visitor hash (GDPR compliant, zero cookie tracking).
    // Сіль з AUTH_SECRET ускладнює відновлення IP з хешу.
    const today = new Date().toISOString().slice(0, 10);
    const salt = process.env.AUTH_SECRET ?? "";
    const visitorHash = crypto
      .createHash("sha256")
      .update(`${ip}_${userAgent}_${today}_${salt}`)
      .digest("hex")
      .slice(0, 16);

    // Deduplication guard (in-memory TTL-cache замість запиту findFirst на кожен event):
    // ігноруємо ідентичні події протягом 3 секунд (React StrictMode / подвійна навігація)
    pruneDedupCache();
    const dedupKey = `${visitorHash}:${path}`;
    const lastSeen = dedupCache.get(dedupKey);
    if (lastSeen !== undefined && Date.now() - lastSeen < 3000) {
      return NextResponse.json({ deduplicated: true });
    }
    dedupCache.set(dedupKey, Date.now());

    // Asynchronously insert into database
    await db.analyticsEvent.create({
      data: {
        path,
        pageType,
        targetId: typeof finalTargetId === "number" ? finalTargetId : null,
        country: country.toUpperCase(),
        city,
        device,
        browser,
        os,
        referer,
        visitorHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
