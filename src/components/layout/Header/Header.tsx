"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./Header.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { useLenis } from "~/context/LenisContext";
import { stripLocaleFromPathname } from "~/lib/locale-path";

export default function Header() {
  const rawPathname = usePathname();
  // Нормалізуємо: /en/art → /art тощо
  const pathname = stripLocaleFromPathname(rawPathname);
  const searchParams = useSearchParams();
  const { getLocalizedHref } = useTranslation();
  // Підписка на скрол Lenis через контекст (window.lenis у lenis@1.3+ — не інстанс)
  const { lenis } = useLenis();

  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  // На сторінці /art, коли жоден художник не вибраний, активний повноекранний ArtHero
  const isArtHeroActive = pathname === "/art" && !searchParams.get("artist");

  useEffect(() => {
    const initScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollY.current = initScrollY;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 40) return;
      lastScrollTime.current = now;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (delta > 6) {
        setIsVisible(false);
      } else if (delta < -6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Підтримка Lenis SmoothScroll через контекст (safe: lenis може бути null до mount)
    if (lenis?.on) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis?.off) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [pathname, searchParams, lenis]);

  if (isHome || isAdmin || isArtHeroActive) {
    return null;
  }

  const isArtPage = pathname.startsWith("/art");

  return (
    <header
      className={`${styles.header} ${isArtPage ? styles.headerArt : ""} ${
        isVisible ? styles.headerVisible : styles.headerHidden
      }`}
    >
      <Link href={getLocalizedHref("/")} className={styles.logoLink} aria-label="VoytArt Gallery — На головну">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/voyt.svg"
          alt="VoytArt Gallery"
          width={160}
          height={38}
          className={styles.logoImage}
        />
      </Link>
    </header>
  );
}
