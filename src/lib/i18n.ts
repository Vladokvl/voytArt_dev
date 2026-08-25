import en from "../messages/en.json";
import uk from "../messages/uk.json";

export type Locale = "en" | "uk";

export const translations = {
  en,
  uk,
};

/** Валюта магазину (винесено в конфіг замість хардкоду) */
export const CURRENCY = "€";

/**
 * Universal fallback accessor for multi-lingual database entities
 * e.g. getLocalized(painting, "title", "uk") -> returns painting.titleUk or painting.title
 */
export function getLocalized<T extends object>(
  entity: T | null | undefined,
  field: string,
  locale: Locale = "en"
): string {
  if (!entity) return "";
  const record = entity as Record<string, unknown>;

  const pick = (key: string): string => {
    const value = record[key];
    return typeof value === "string" && value.trim() !== "" ? value : "";
  };

  if (locale === "uk") {
    const ukValue = pick(`${field}Uk`);
    if (ukValue) return ukValue;
  }

  return pick(field);
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
  return `${amount.toLocaleString(intlLocale)} ${CURRENCY}`;
}
