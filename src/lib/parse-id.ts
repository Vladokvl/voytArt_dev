/**
 * Безпечний парсинг числового URL-параметра: "abc" | "" | "0" | "-5" → null,
 * "12" → 12. Захищає від NaN, що призводить до 500 помилок у Prisma-запитах.
 */
export function parseIdParam(value: string | undefined | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}