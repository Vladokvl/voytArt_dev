"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./Header.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getLocalizedHref } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const isTransitioningRef = useRef(false);

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  // На сторінці /art, коли жоден художник не вибраний, активний повноекранний ArtHero
  const isArtHeroActive = pathname === "/art" && !searchParams.get("artist");

  useEffect(() => {
    const initScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollY.current = initScrollY;

    const isHeroPage = pathname === "/gallery";
    const isArt = pathname.startsWith("/art");

    let timer: ReturnType<typeof setTimeout> | null = null;

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
    
    // Підтримка Lenis SmoothScroll
    const lenis = (window as unknown as { lenis?: { on: (evt: string, fn: () => void) => void; off: (evt: string, fn: () => void) => void } }).lenis;
    if (lenis?.on) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis?.off) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [pathname, searchParams]);

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
