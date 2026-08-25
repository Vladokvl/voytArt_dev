"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { type Locale, translations } from "~/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  getLocalizedHref: (href: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "voyt_locale";
const COOKIE_NAME = "NEXT_LOCALE";

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const getLocalizedHref = useCallback(
    (href: string): string => {
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
        return href;
      }
      try {
        const [base, hash] = href.split("#");
        const [path, query] = (base ?? "").split("?");
        const params = new URLSearchParams(query ?? "");

        if (locale === "uk") {
          params.set("lang", "ua");
        } else {
          params.delete("lang");
        }

        const queryString = params.toString();
        const hashString = hash ? `#${hash}` : "";
        return `${path}${queryString ? `?${queryString}` : ""}${hashString}`;
      } catch {
        return href;
      }
    },
    [locale]
  );

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (newLocale === "uk") {
          url.searchParams.set("lang", "ua");
        } else {
          url.searchParams.delete("lang");
        }
        window.history.replaceState(null, "", url.toString());
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lang")?.toLowerCase();

        if (urlLang === "ua" || urlLang === "uk") {
          setLocaleState("uk");
          localStorage.setItem(STORAGE_KEY, "uk");
          document.cookie = `${COOKIE_NAME}=uk; path=/; max-age=31536000; SameSite=Lax`;
          return;
        } else if (urlLang === "en") {
          setLocaleState("en");
          localStorage.setItem(STORAGE_KEY, "en");
          document.cookie = `${COOKIE_NAME}=en; path=/; max-age=31536000; SameSite=Lax`;
          return;
        }
      }

      const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (savedLocale === "en" || savedLocale === "uk") {
        if (savedLocale !== initialLocale) {
          setLocaleState(savedLocale);
          document.cookie = `${COOKIE_NAME}=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }
    } catch {
      // ignore
    }
  }, [initialLocale]);

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
