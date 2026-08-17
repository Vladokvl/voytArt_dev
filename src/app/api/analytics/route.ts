import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import crypto from "crypto";

function parseDeviceAndBrowser(userAgent: string) {
  const ua = userAgent.toLowerCase();

  let device = "Desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "Mobile";
  } else if (/ipad|tablet/i.test(ua)) {
    device = "Tablet";
  }

  let os = "Other";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";

  let browser = "Other";
  if (ua.includes("telegram")) browser = "Telegram";
  else if (ua.includes("instagram")) browser = "Instagram";
  else if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg/")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";

  return { device, os, browser };
}

function parseReferrer(rawReferrer: string, userAgent: string): string {
  const ref = rawReferrer.toLowerCase();
  const ua = userAgent.toLowerCase();

  if (ua.includes("telegram") || ref.includes("t.me") || ref.includes("telegram")) {
    return "Telegram";
  }
  if (ua.includes("instagram") || ref.includes("instagram.com") || ref.includes("l.instagram.com")) {
    return "Instagram";
  }
  if (ref.includes("google.com") || ref.includes("google.")) {
    return "Google";
  }
  if (ref.includes("facebook.com") || ref.includes("fb.com") || ref.includes("l.facebook.com")) {
    return "Facebook";
  }
  if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) {
    return "Twitter / X";
  }
  if (ref.includes("tiktok.com")) {
    return "TikTok";
  }
  if (!ref || ref === "" || ref.includes(process.env.NEXT_PUBLIC_APP_URL || "localhost")) {
    return "Direct";
  }

  try {
    const url = new URL(rawReferrer);
    return url.hostname.replace("www.", "");
  } catch {
    return "Other";
  }
}

function categorizePage(path: string): string {
  if (path === "/") return "HOME";
  if (path === "/shop") return "SHOP";
  if (path.startsWith("/shop/")) return "PRODUCT";
  if (path.startsWith("/art")) return "ART";
  if (path.startsWith("/gallery")) return "GALLERY";
  return "OTHER";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path = "/" } = body as { path?: string };

    // Ignore admin & api routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ignored: true });
    }

    const userAgent = req.headers.get("user-agent") || "";
    // Ignore bots & crawlers from corrupting visit metrics
    if (/bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider/i.test(userAgent)) {
      return NextResponse.json({ bot: true });
    }

    const rawReferrer = req.headers.get("referer") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1";

    // Country from Cloudflare / Vercel headers
    let country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country");
    if (!country || country === "XX" || country === "T1") {
      country = "UA"; // Default fallback for local testing
    }

    const city = req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity") || null;

    const { device, os, browser } = parseDeviceAndBrowser(userAgent);
    const referer = parseReferrer(rawReferrer, userAgent);
    const pageType = categorizePage(path);

    // Anonymized daily visitor hash (GDPR compliant, zero cookie tracking)
    const today = new Date().toISOString().slice(0, 10);
    const visitorHash = crypto
      .createHash("sha256")
      .update(`${ip}_${userAgent}_${today}`)
      .digest("hex")
      .slice(0, 16);

    // Asynchronously insert into database
    await db.analyticsEvent.create({
      data: {
        path,
        pageType,
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
