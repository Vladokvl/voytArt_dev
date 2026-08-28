import { describe, expect, it } from "vitest";
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

describe("sanitizeAnalyticsPath", () => {
  it("accepts valid internal paths and strips locale prefix", () => {
    expect(sanitizeAnalyticsPath("/en/shop/5")).toBe("/shop/5");
    expect(sanitizeAnalyticsPath("/uk/art?artist=3")).toBe("/art?artist=3");
    expect(sanitizeAnalyticsPath("/gallery/12")).toBe("/gallery/12");
  });

  it("keeps non-localized paths as-is", () => {
    expect(sanitizeAnalyticsPath("/shop")).toBe("/shop");
  });

  it("rejects garbage from client", () => {
    expect(sanitizeAnalyticsPath("not-a-path")).toBeNull();
    expect(sanitizeAnalyticsPath("../etc/passwd")).toBeNull();
    expect(sanitizeAnalyticsPath("/foo/../bar")).toBeNull();
    // контрольні символи
    expect(sanitizeAnalyticsPath("/x\u0000y")).toBeNull();
    expect(sanitizeAnalyticsPath(42)).toBeNull();
    expect(sanitizeAnalyticsPath(undefined)).toBeNull();
  });

  it("caps path length at 300 chars", () => {
    const long = "/" + "a".repeat(1000);
    expect(sanitizeAnalyticsPath(long)).toHaveLength(300);
  });
});

describe("sanitizeTargetId", () => {
  it("accepts positive integers within Int32", () => {
    expect(sanitizeTargetId(1)).toBe(1);
    expect(sanitizeTargetId(123456)).toBe(123456);
    expect(sanitizeTargetId(0x7fffffff)).toBe(0x7fffffff);
  });

  it("rejects floats, negatives, zero and overflow (захист від Prisma-помилки → 500)", () => {
    expect(sanitizeTargetId(1.5)).toBeNull();
    expect(sanitizeTargetId(-5)).toBeNull();
    expect(sanitizeTargetId(0)).toBeNull();
    expect(sanitizeTargetId(0x80000000)).toBeNull();
    expect(sanitizeTargetId(Number.NaN)).toBeNull();
    expect(sanitizeTargetId(Number.MAX_SAFE_INTEGER + 1)).toBeNull();
    expect(sanitizeTargetId("12abc")).toBeNull();
  });
});

describe("normalizeCustomPageType", () => {
  it("passes whitelisted values (case-insensitive)", () => {
    expect(normalizeCustomPageType("ARTIST")).toBe("ARTIST");
    expect(normalizeCustomPageType("product")).toBe("PRODUCT");
    expect(normalizeCustomPageType(" Painting ")).toBe("PAINTING");
  });

  it("drops unknown values so server falls back to categorizePage", () => {
    expect(normalizeCustomPageType("HACKED'--")).toBeUndefined();
    expect(normalizeCustomPageType("A".repeat(500))).toBeUndefined();
    expect(normalizeCustomPageType(undefined)).toBeUndefined();
    expect(normalizeCustomPageType(123)).toBeUndefined();
  });
});

describe("categorizePage", () => {
  it("maps normalized paths to page types", () => {
    expect(categorizePage("/")).toBe("HOME");
    expect(categorizePage("/art?artist=5")).toBe("GALLERY");
    expect(categorizePage("/shop/12")).toBe("SHOP");
    expect(categorizePage("/gallery")).toBe("POSTS");
    expect(categorizePage("/unknown-page")).toBe("OTHER");
  });
});

describe("parseDeviceAndBrowser", () => {
  it("detects in-app browsers (специфіка аудиторії Telegram/Instagram)", () => {
    const tg = parseDeviceAndBrowser(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Telegram-iOS",
    );
    expect(tg.browser).toBe("Telegram In-App");
    expect(tg.device).toBe("Mobile");
    expect(tg.os).toBe("iOS");

    const insta = parseDeviceAndBrowser(
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Instagram",
    );
    expect(insta.browser).toBe("Instagram In-App");
  });

  it("defaults to Desktop/Chrome on desktop UA", () => {
    const d = parseDeviceAndBrowser(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36",
    );
    expect(d.device).toBe("Desktop");
    expect(d.os).toBe("Windows");
    expect(d.browser).toBe("Chrome");
  });
});

describe("parseReferrer", () => {
  it("identifies traffic sources", () => {
    expect(parseReferrer("https://www.google.com/search?q=art", "")).toBe("Google Search");
    expect(parseReferrer("https://instagram.com/p/123", "")).toBe("Instagram");
    expect(parseReferrer("", "")).toBe("Direct");
  });

  it("falls back safely on malformed referrer", () => {
    expect(parseReferrer("::::not a url:::", "")).not.toContain("http");
  });
});

describe("isPrivateIp / normalizeIp / BOT_UA_RE", () => {
  it("detects private ranges and localhost", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.5")).toBe(true);
    expect(isPrivateIp("192.168.1.1")).toBe(true);
    expect(isPrivateIp("172.16.9.9")).toBe(true);
    expect(isPrivateIp("8.8.8.8")).toBe(false);
  });

  it("normalizes IPv6-mapped IPv4", () => {
    expect(normalizeIp("::ffff:77.122.5.9")).toBe("77.122.5.9");
    expect(normalizeIp(" 77.122.5.9 ")).toBe("77.122.5.9");
  });

  it("matches common bots but not human UAs", () => {
    expect(BOT_UA_RE.test("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(BOT_UA_RE.test("Mozilla/5.0 Chrome/126 Safari/537.36")).toBe(false);
  });
});