/**
 * Чисті (без залежностей від next/db) хелпери для /api/analytics.
 * Винесені окремо для юніт-тестування та повторного використання.
 */
import { stripLocaleFromPathname } from "~/lib/locale-path";

/** Regex для відсіювання ботів і краулерів по User-Agent */
export const BOT_UA_RE =
  /bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider/i;

type DeviceInfo = {
  device: string;
  os: string;
  browser: string;
};

export function parseDeviceAndBrowser(userAgent: string): DeviceInfo {
  let device = "Desktop";
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
    device = /ipad|tablet/i.test(userAgent) ? "Tablet" : "Mobile";
  }

  let os = "Other";
  // ВАЖЛИВО: iOS перевіряємо ДО macOS — iPhone/iPad UA містять підрядок
  // "Mac OS X" ("CPU iPhone OS 17_0 like Mac OS X"), і без цього весь iOS-трафік
  // помилково класифікувався б як macOS.
  if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
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

export function parseReferrer(rawReferrer: string, userAgent: string): string {
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

export function categorizePage(path: string): string {
  if (path === "/" || path === "") return "HOME";
  if (path.startsWith("/art")) return "GALLERY";
  if (path.startsWith("/shop")) return "SHOP";
  if (path.startsWith("/cart")) return "CART";
  if (path.startsWith("/checkout")) return "CHECKOUT";
  if (path.startsWith("/gallery")) return "POSTS";
  return "OTHER";
}

export function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd")) return true;
  return false;
}

/**
 * Санітизація path події від клієнта:
 * - обов'язково внутрішня адреса (починається з "/");
 * - без контрольних символів та "../" транкерсів;
 * - префікс локалі стрипається, довжина обмежена 300 символами.
 * Повертає null для сміттєвих значень (їх не записуємо).
 */
export function sanitizeAnalyticsPath(rawPath: unknown): string | null {
  if (typeof rawPath !== "string") return null;
  if (/[\u0000-\u001f\u007f]/.test(rawPath)) return null;
  if (!rawPath.startsWith("/") || rawPath.includes("..")) return null;
  const path = stripLocaleFromPathname(rawPath).slice(0, 300);
  return path.startsWith("/") ? path : null;
}

/**
 * Клієнтський pageType приймаємо лише зі whitelist (сире значення могло б бути
 * будь-яким рядком довільної довжини). Невідоме значення → undefined (пагине
 * у categorizePage на сервері).
 */
const PAGE_TYPE_WHITELIST = ["ARTIST", "PRODUCT", "PAINTING"];

export function normalizeCustomPageType(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().toUpperCase();
  return (PAGE_TYPE_WHITELIST as readonly string[]).includes(v) ? v : undefined;
}

/**
 * Валідація targetId: ціле додатне число в межах Int32 (тип колонки Prisma Int).
 * Float / від'ємні / переповнення → null (замість помилки БД → 500).
 */
export function sanitizeTargetId(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isInteger(n) && n > 0 && n <= 0x7fffffff ? n : null;
}

/** Нормалізація IPv6-mapped IPv4 ("::ffff:1.2.3.4" → "1.2.3.4") */
export function normalizeIp(rawIp: string): string {
  return rawIp.trim().replace(/^::ffff:/i, "");
}