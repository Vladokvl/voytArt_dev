import { describe, expect, it } from "vitest";
import { parseIdParam } from "~/lib/parse-id";

describe("parseIdParam", () => {
  it('parses valid positive integer strings, e.g. "12" → 12', () => {
    expect(parseIdParam("12")).toBe(12);
    expect(parseIdParam("1")).toBe(1);
  });

  it('returns null for non-numeric strings, e.g. "abc" (захист від NaN → Prisma 500)', () => {
    expect(parseIdParam("abc")).toBeNull();
    expect(parseIdParam("12abc")).toBeNull();
  });

  it("returns null for empty/undefined/null values", () => {
    expect(parseIdParam(undefined)).toBeNull();
    expect(parseIdParam(null)).toBeNull();
    expect(parseIdParam("")).toBeNull();
  });

  it("returns null for zero and negative numbers", () => {
    expect(parseIdParam("0")).toBeNull();
    expect(parseIdParam("-5")).toBeNull();
  });

  it("returns null for floats and numeric edge cases", () => {
    expect(parseIdParam("3.7")).toBeNull();
    expect(parseIdParam("NaN")).toBeNull();
    expect(parseIdParam("Infinity")).toBeNull();
  });
});