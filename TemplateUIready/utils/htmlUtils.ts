/**
 * Check if HTML content is effectively empty (no meaningful text).
 * TipTap/ProseMirror empty state returns <p></p> or <p><br></p>.
 */
export const isHtmlContentEmpty = (html: string | undefined): boolean => {
  if (!html || typeof html !== 'string') return true
  const stripped = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.length === 0
}
