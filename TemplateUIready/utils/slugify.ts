import transliterate from '@sindresorhus/transliterate'

export function slugify(text: string): string {
  const transliterated = transliterate(text)
  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
