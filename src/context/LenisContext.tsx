"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type Lenis from "lenis";

/**
 * Контекст для доступу до інстансу Lenis.
 *
 * ⚠️ ВАЖЛИВО: не використовуйте `window.lenis` — пакет `lenis` (v1.3+) сам
 * записує туди свій об'єкт метаданих/опцій (`if (!window.lenis) window.lenis = {}`),
 * тому це НЕ інстанс і виклик `.start()` там падає.
 * Завжди використовуйте `useLenis()` з цього контексту.
 */
type LenisContextValue = {
  /** Активний інстанс Lenis або `null` до монтування `SmoothScroll` */
  lenis: Lenis | null;
  /** Безпечно зупинити smooth scroll (для відкритих модалок) */
  stop: () => void;
  /** Безпечно відновити smooth scroll */
  start: () => void;
};

/** Навмисний no-op для дефолтного значення контексту (поза LenisProvider) */
const noop = (): void => undefined;

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  stop: noop,
  start: noop,
});

export function LenisProvider({
  lenis,
  children,
}: {
  lenis: Lenis | null;
  children: ReactNode;
}) {
  const value = useMemo<LenisContextValue>(
    () => ({
      lenis,
      stop: () => {
        if (typeof lenis?.stop === "function") lenis.stop();
      },
      start: () => {
        if (typeof lenis?.start === "function") lenis.start();
      },
    }),
    [lenis],
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

/** Хук доступу до Lenis: `const { lenis, start, stop } = useLenis();` */
export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}