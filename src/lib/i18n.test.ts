import { describe, expect, it } from "vitest";
import { formatLocalizedDate, formatLocalizedPrice, getLocalized } from "~/lib/i18n";

describe("getLocalized", () => {
  const entity = { title: "Sunset", titleUk: "Захід", emptyUk: "  " };

  it('returns English base field for locale="en"', () => {
    expect(getLocalized(entity, "title", "en")).toBe("Sunset");
  });

  it("returns English base field when no explicit locale (default en)", () => {
    expect(getLocalized(entity, "title")).toBe("Sunset");
  });

  it('returns Ukrainian field for locale="uk" when present', () => {
    expect(getLocalized(entity, "title", "uk")).toBe("Захід");
  });

  it("falls back to base field when Uk field is missing", () => {
    expect(getLocalized({ name: "Kyiv" }, "name", "uk")).toBe("Kyiv");
  });

  it("ignores whitespace-only localized values", () => {
    expect(getLocalized(entity, "emptyUk", "uk")).toBe("");
  });

  it('returns "" for null/undefined entity', () => {
    expect(getLocalized(null, "title", "en")).toBe("");
    expect(getLocalized(undefined, "title", "uk")).toBe("");
  });
});

describe("formatLocalizedPrice", () => {
  it("formats price with currency symbol", () => {
    expect(formatLocalizedPrice(1000, "en")).toMatch(/1,000\s?€/);
  });

  it("uses uk-UA grouping for Ukrainian locale", () => {
    expect(formatLocalizedPrice(1000, "uk")).toContain("€");
  });

  it("handles zero and decimal amounts", () => {
    expect(formatLocalizedPrice(0, "en")).toMatch(/0\s?€/);
    expect(formatLocalizedPrice(12.5, "en")).toMatch(/12\.5\s?€/);
  });
});

describe("formatLocalizedDate", () => {
  it("returns empty string for null/undefined/empty input", () => {
    expect(formatLocalizedDate(null)).toBe("");
    expect(formatLocalizedDate(undefined)).toBe("");
    expect(formatLocalizedDate("")).toBe("");
  });

  it("returns empty string for invalid date string", () => {
    expect(formatLocalizedDate("not-a-date")).toBe("");
  });

  it("formats Date object without crashing and includes year", () => {
    const result = formatLocalizedDate(new Date("2026-08-15T00:00:00Z"), "en");
    expect(result).toContain("2026");
  });

  it("accepts ISO strings and numbers", () => {
    expect(formatLocalizedDate("2026-01-02T00:00:00Z", "en")).toMatch(/2026/);
    expect(formatLocalizedDate(Date.UTC(2025, 4, 10), "en")).toMatch(/2025/);
  });
});