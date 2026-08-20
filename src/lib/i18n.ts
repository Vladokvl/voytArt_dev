import en from "../messages/en.json";
import uk from "../messages/uk.json";

export type Locale = "en" | "uk";

export const translations = {
  en,
  uk,
};

/**
 * Universal fallback accessor for multi-lingual database entities
 * e.g. getLocalized(painting, "title", "uk") -> returns painting.titleUk or painting.title
 */
export function getLocalized<T extends Record<string, any>>(
  entity: T | null | undefined,
  field: string,
  locale: Locale = "en"
): string {
  if (!entity) return "";

  if (locale === "uk") {
    const ukField = `${field}Uk`;
    if (entity[ukField] && typeof entity[ukField] === "string" && entity[ukField].trim() !== "") {
      return entity[ukField];
    }
  }

  const enField = `${field}En`;
  if (entity[enField] && typeof entity[enField] === "string" && entity[enField].trim() !== "") {
    return entity[enField];
  }

  return (entity[field] as string) || "";
}

/**
 * Formats date into localized string (e.g. "12 August 2026" or "12 серпня 2026")
 */
export function formatLocalizedDate(
  date: string | Date | number | null | undefined,
  locale: Locale = "en"
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const intlLocale = locale === "uk" ? "uk-UA" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Formats price with proper localized currency display
 */
export function formatLocalizedPrice(amount: number, locale: Locale = "en"): string {
  const intlLocale = locale === "uk" ? "uk-UA" : "en-US";
  return `${amount.toLocaleString(intlLocale)} €`;
}
