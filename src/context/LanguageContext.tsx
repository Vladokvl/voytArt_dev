"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Locale, translations } from "~/lib/i18n";
import { withLocalePrefix, stripLocaleFromPathname } from "~/lib/locale-path";

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  getLocalizedHref: (href: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const COOKIE_NAME = "NEXT_LOCALE";

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  // Джерело правди — URL (/en | /uk). Синхронізуємо стан після навігації
  // між локалями (startState спрацьовує лише один раз).
  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  /**
   * Перемикання мови = навігація на той самий шлях з іншим префіксом локалі.
   * Cookie зберігається як fallback для детектції локалі в middleware
   * та для адмінки (яка поза [locale]).
   */
  const setLocale = useCallback(
    (newLocale: Locale) => {
      try {
        document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // ignore
      }

      if (typeof window === "undefined") return;

      const { pathname, search } = window.location;
      const restPath = stripLocaleFromPathname(pathname);
      // Шлях адмінки / не-публічні сторінки — залишаємо без префікса
      const target =
        restPath.startsWith("/admin")
          ? pathname
          : `/${newLocale}${restPath === "/" ? "" : restPath}${search}`;

      router.push(target);
    },
    [router]
  );

  /** Локалізує внутрішні посилання: "/art?a=1" → "/uk/art?a=1" */
  const getLocalizedHref = useCallback(
    (href: string): string => withLocalePrefix(locale, href),
    [locale]
  );

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const resolve = (loc: Locale): string | undefined => {
        let result: unknown = translations[loc];
        for (const key of path.split(".")) {
          if (result && typeof result === "object" && key in (result as Record<string, unknown>)) {
            result = (result as Record<string, unknown>)[key];
          } else {
            return undefined;
          }
        }
        return typeof result === "string" ? result : undefined;
      };

      const result = resolve(locale) ?? resolve("en") ?? path;

      if (params) {
        return Object.entries(params).reduce((acc, [pKey, pVal]) => {
          return acc.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
        }, result);
      }

      return result;
    },
    [locale]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      getLocalizedHref,
    }),
    [locale, setLocale, t, getLocalizedHref]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

export function useTranslation() {
  const { t, locale, getLocalizedHref } = useLanguage();
  return { t, locale, getLocalizedHref };
}
