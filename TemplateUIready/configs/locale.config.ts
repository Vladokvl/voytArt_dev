export const DEFAULT_LOCALE = 'en' as const

export type ActiveLocale = typeof DEFAULT_LOCALE

export const ACTIVE_LOCALES = [DEFAULT_LOCALE] as const

export const LOCALE_META: Record<ActiveLocale, { label: string; flag: string }> = {
  [DEFAULT_LOCALE]: { label: 'English', flag: 'US' },
}

export function isActiveLocale(value: string): value is ActiveLocale {
  return value === DEFAULT_LOCALE
}
