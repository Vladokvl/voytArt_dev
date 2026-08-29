import DOMPurify from "isomorphic-dompurify";

/**
 * Санітизація HTML з БД (Tiptap-контент описів товарів/картин/постів) перед
 * рендером через dangerouslySetInnerHTML — захист від Stored XSS
 * (<script>, event-handler атрибути, javascript:-URL, iframe тощо).
 *
 * Tiptap-розмітка (заголовки, списки, лінки, картинки, блокноти, inline-стилі)
 * зберігається повністю.
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // text & structure
    "p", "br", "hr", "span", "div",
    "strong", "em", "u", "s", "sub", "sup", "mark", "code", "pre",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "blockquote",
    // media / links
    "a", "img", "figure", "figcaption",
    // tables (Tiptap може їх генерити)
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: [
    "href", "src", "srcset", "alt", "title", "target", "rel",
    "class", "style", "start", "colspan", "rowspan",
  ],
  // Забороняємо небезпечні протоколи (javascript:, data: для a/href тощо)
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|#|\/|\.\/|\.\.\/)|data:image\/(?:png|jpe?g|gif|webp);)/i,
};

// Автоматично додаємо rel="noopener noreferrer" для всіх посилань із target="_blank"
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}