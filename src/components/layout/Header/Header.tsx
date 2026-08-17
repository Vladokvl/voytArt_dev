"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
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

    if (isHeroPage && initScrollY < 120) {
      setIsVisible(false);
    } else if (isArt) {
      // На сторінці артів блокуємо появу хедера на 1.25с, поки шторка повністю не підніметься
      setIsVisible(false);
      isTransitioningRef.current = true;
      timer = setTimeout(() => {
        isTransitioningRef.current = false;
        setIsVisible(true);
      }, 1250);
    } else if (initScrollY < 40) {
      setIsVisible(true);
    }

    const handleScroll = () => {
      // Ігноруємо скрол-івенти під час переходів шторки
      if (isTransitioningRef.current) return;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      const isAtHeroTop = pathname === "/gallery" && currentScrollY < 120;

      if (isAtHeroTop) {
        setIsVisible(false);
      } else if (currentScrollY < 30) {
        // На самому верху сторінки (в т.ч. /art та /shop) — видимий
        setIsVisible(true);
      } else if (delta > 6) {
        // Скрол ВНИЗ -> плавно ховаємо вгору
        setIsVisible(false);
      } else if (delta < -6) {
        // Скрол ВГОРУ -> плавно виїжджає зверху
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
      if (timer) {
        clearTimeout(timer);
      }
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
      <Link href="/" className={styles.logoLink} aria-label="VoytArt Gallery — На головну">
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
