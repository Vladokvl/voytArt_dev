/**
 * Route-based locale утиліти (pure, без залежностей — safe для middleware/client/server).
 *
 * Публічні сторінки живуть під префіксом локалі: /en/art, /uk/shop/1 ...
 * Адмінка (/admin) поза локаллю.
 */

export const ROUTE_LOCALES = ["en", "uk"] as const;
export type RouteLocale = (typeof ROUTE_LOCALES)[number];
export const DEFAULT_ROUTE_LOCALE: RouteLocale = "en";

/** Вузький guard для валідного значення локалі */
export function isRouteLocale(value: string | null | undefined): value is RouteLocale {
  return (ROUTE_LOCALES as readonly string[]).includes(value ?? "");
}

/**
 * Прибирає префікс локалі з pathname: "/uk/art?neon=true#x" → "/art".
 * Шлях без префікса повертається як є (нормалізує trailing edge-cases навколо кореня).
 */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const second = segments[1];
  if (second !== undefined && isRouteLocale(second)) {
    const rest = "/" + segments.slice(2).join("/");
    // "/" → "" щоб порівняння path === "/" або "" працювали однаково
    return rest.replace(/^\/$/, "/");
  }
  return pathname;
}

/** Витягує локаль із pathname або null, якщо її там нема */
export function getLocaleFromPathname(pathname: string): RouteLocale | null {
  const second = pathname.split("/")[1];
  return isRouteLocale(second) ? second : null;
}

/**
 * Додає префікс локалі до внутрішнього шляху/лінка:
 * withLocalePrefix("uk", "/art?a=1#top") → "/uk/art?a=1#top"
 * Зовнішні лінки, mailto:, tel:, # — повертає без змін.
 */
export function withLocalePrefix(
  locale: string,
  href: string,
): string {
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  try {
    const [basePart, hashPart] = href.split("#");
    const [pathPart, queryPart] = (basePart ?? "").split("?");

    // Не подвоюємо префікс, якщо він уже є
    const basePath =
      pathPart && getLocaleFromPathname(pathPart) !== null
        ? pathPart
        : `/${locale}${pathPart && pathPart !== "/" ? pathPart : ""}`;

    const hashString = hashPart !== undefined ? `#${hashPart}` : "";
    const queryString = queryPart ? `?${queryPart}` : "";
    return `${basePath || `/${locale}`}${queryString}${hashString}`;
  } catch {
    return href;
  }
}