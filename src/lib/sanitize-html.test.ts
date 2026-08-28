import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "~/lib/sanitize-html";

describe("sanitizeHtml (захист від Stored XSS у Tiptap-контенті)", () => {
  it("strips <script> tags entirely", () => {
    expect(sanitizeHtml("<p>ok</p><script>alert(1)</script>")).toBe("<p>ok</p>");
  });

  it("strips event-handler attributes (onerror, onload)", () => {
    const out = sanitizeHtml('<img src="https://example.com/x.png" onerror="alert(1)">');
    expect(out).not.toContain("onerror");
    expect(out).toContain("<img");
  });

  it("blocks javascript: URLs in links and images", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    expect(sanitizeHtml('<img src="javascript:alert(1)">')).not.toContain("javascript:");
  });

  it("removes iframes / object / embed", () => {
    const out = sanitizeHtml('<iframe src="//evil.com"></iframe><object></object>');
    expect(out).not.toContain("<iframe");
    expect(out).not.toContain("evil.com");
  });

  it("keeps legitimate Tiptap markup intact", () => {
    const html =
      '<h2>Заголовок</h2><p style="text-align:center">Текст <strong>жирний</strong></p>' +
      '<ul><li>пункт</li></ul><a href="https://voyt.art" rel="noopener">лінк</a>';
    const out = sanitizeHtml(html);
    expect(out).toContain("<h2>Заголовок</h2>");
    expect(out).toContain("<strong>жирний</strong>");
    expect(out).toContain("<li>пункт</li>");
    expect(out).toContain('href="https://voyt.art"');
  });

  it("handles null/undefined/empty safely", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
    expect(sanitizeHtml("")).toBe("");
  });
});