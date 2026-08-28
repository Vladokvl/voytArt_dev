import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import crypto from "crypto";
import { rateLimit, getClientIp } from "~/lib/rate-limit";
import {
  BOT_UA_RE,
  categorizePage,
  isPrivateIp,
  normalizeCustomPageType,
  normalizeIp,
  parseDeviceAndBrowser,
  parseReferrer,
  sanitizeAnalyticsPath,
  sanitizeTargetId,
} from "~/lib/analytics-helpers";

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

/** Миттєва геолокація лише з edge/reverse-proxy headers (без мережевих запитів) */
function readGeoFromHeaders(req: NextRequest): { country: string; city: string | null } | null {
  const headerCountry =
    req.headers.get("cf-ipcountry") ??
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cloudfront-viewer-country") ??
    req.headers.get("x-country-code") ??
    req.headers.get("x-geo-country");

  if (!headerCountry || headerCountry === "XX" || headerCountry === "T1" || headerCountry.length !== 2) {
    return null;
  }

  const headerCity =
    req.headers.get("x-vercel-ip-city") ??
    req.headers.get("cf-ipcity") ??
    req.headers.get("cloudfront-viewer-city") ??
    null;

  return { country: headerCountry.toUpperCase(), city: headerCity };
}

/**
 * Зовнішній HTTPS-провайдер геолокації (ipwho.is) — викликається ТІЛЬКИ
 * асинхронно, після запису події в БД, щоб не блокувати запит клієнта.
 * Результат оновлюється в записі постфактум; HTTP ip-api.com прибрано
 * (приватність IP-адрес користувачів).
 */
async function resolveGeoExternal(rawIp: string): Promise<{ country: string; city: string | null }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`https://ipwho.is/${encodeURIComponent(rawIp)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as { success?: boolean; country_code?: string; city?: string };
      if (data.success && data.country_code?.length === 2) {
        const result = { country: data.country_code.toUpperCase(), city: data.city ?? null };
        cacheGeo(rawIp, result);
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
  const now = Date.now();
  // Спочатку прибираємо записи поза TTL-вікном (3 с дедупа + запас)
  for (const [key, ts] of dedupCache) {
    if (now - ts > 5000) dedupCache.delete(key);
  }
  // Жорсткий FIFO-кап: навіть якщо всі записи свіжі (спам унікальними ключами),
  // не даємо кешу рости необмежено
  while (dedupCache.size >= DEDUP_CACHE_MAX) {
    const oldest = dedupCache.keys().next().value;
    if (oldest === undefined) break;
    dedupCache.delete(oldest);
  }
}


export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // Rate-limit: максимум 30 подій за хвилину на IP (+ Retry-After для чесних клієнтів)
    const rl = rateLimit(`analytics:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      path?: string;
      pageType?: string;
      targetId?: number;
    };

    // ─── Санітизація вхідних даних (усі поля приходять від клієнта) ─────────
    const userAgent = req.headers.get("user-agent") ?? "";
    // Без User-Agent (curl/скрипти) чи підозріло короткий UA — не записуємо
    if (userAgent.length < 15) {
      return NextResponse.json({ ignored: true });
    }
    // Ignore bots & crawlers from corrupting visit metrics
    if (BOT_UA_RE.test(userAgent)) {
      return NextResponse.json({ bot: true });
    }

    const path = sanitizeAnalyticsPath(body.path ?? "/");
    if (!path) {
      return NextResponse.json({ ignored: true, reason: "invalid path" });
    }

    const customPageType = normalizeCustomPageType(body.pageType);
    let finalTargetId = sanitizeTargetId(body.targetId);

    // Ignore admin & api routes (після санітизації path)
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ignored: true });
    }

    // Auto extract targetId from shop path if not explicitly provided
    if (!finalTargetId && path.startsWith("/shop/")) {
      finalTargetId = sanitizeTargetId(path.slice("/shop/".length).split(/[?#/]/)[0]);
    }

    const rawReferrer = req.headers.get("referer") ?? "";

    // ─── Геолокація: миттєво з headers/кеша; зовнішній API — тільки асинхронно ──
    const ip = normalizeIp(clientIp === "unknown" ? "" : clientIp);
    let country = "UNKNOWN";
    let city: string | null = null;
    let needsAsyncGeo = false;

    const headerGeo = readGeoFromHeaders(req);
    if (headerGeo) {
      ({ country, city } = headerGeo);
    } else if (isPrivateIp(ip)) {
      country = "UA";
      city = "Localhost";
    } else {
      const cached = geoCache.get(ip);
      if (cached) {
        ({ country, city } = cached);
      } else {
        needsAsyncGeo = true; // заповнимо постфактум, не блокуючи відповідь
      }
    }

    const { device, os, browser } = parseDeviceAndBrowser(userAgent);
    const referer = parseReferrer(rawReferrer, userAgent);
    const pageType = customPageType ?? categorizePage(path);

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

    // Записуємо подію ОДРАЗУ (гео може бути UNKNOWN — оновимо нижче)
    const created = await db.analyticsEvent.create({
      data: {
        path,
        pageType,
        targetId: finalTargetId,
        country,
        city,
        device,
        browser,
        os,
        referer,
        visitorHash,
      },
    });

    // Fire-and-forget дозапис геолокації з зовнішнього провайдера (≤1.2с),
    // щоб геозапит ніколи не блокував відповідь клієнту.
    if (needsAsyncGeo) {
      void resolveGeoExternal(ip)
        .then((geo) =>
          geo.country !== "UNKNOWN"
            ? db.analyticsEvent.update({
                where: { id: created.id },
                data: { country: geo.country, city: geo.city },
              })
            : undefined,
        )
        .catch(() => {
          // Гео не критичне — тихо ігноруємо помилки фонового оновлення
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
