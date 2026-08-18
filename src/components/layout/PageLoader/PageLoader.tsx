"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import styles from "./PageLoader.module.scss";

// ══════════════════════════════════════════════════════════════════════════════
// PageLoader — екран завантаження сторінки
// • Якщо кадри ще вантажаться: показує кругле відео-лого та чекає hero-ready
// • Якщо кадри вже в кеші: показує статичне лого і миттєво плавно розчиняється
// ══════════════════════════════════════════════════════════════════════════════
const LOADER_PAGES = ["/"];
const HERO_READY_EVENT = "voyt:hero-ready";

export default function PageLoader() {
  const pathname = usePathname();
  const isLoaderPage = LOADER_PAGES.includes(pathname);

  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isCached, setIsCached] = useState(false);

  // Перевірка стану кешу при першому клієнтському маунті
  useEffect(() => {
    try {
      if (
        sessionStorage.getItem("voyt_hero_cached") === "true" ||
        (window as Window & { __voytHeroReady?: boolean }).__voytHeroReady
      ) {
        setIsCached(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Синхронізація позиції circleWrapper з heroContent ──────────────────────
  useEffect(() => {
    if (!isLoaderPage) return;

    const wrapper = circleWrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper) return;

    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;

    const syncPosition = (el: Element) => {
      const rect = el.getBoundingClientRect();
      wrapper.style.top = `${rect.top}px`;
      wrapper.style.left = `${rect.left}px`;
      wrapper.style.width = `${rect.width}px`;
      wrapper.style.height = `${rect.height}px`;
    };

    const tryConnect = () => {
      const heroContent = document.getElementById("hero-content");
      if (!heroContent) return false;
      syncPosition(heroContent);

      const circle = circleRef.current;
      if (circle) gsap.to(circle, { opacity: 1, duration: 0.2, ease: "none" });

      ro = new ResizeObserver(() => syncPosition(heroContent));
      ro.observe(heroContent);

      // Якщо вже закешовано — робимо швидкий і плавний fade-out оверлею
      const isAlreadyReady =
        (window as Window & { __voytHeroReady?: boolean }).__voytHeroReady ||
        sessionStorage.getItem("voyt_hero_cached") === "true";

      if (isAlreadyReady && overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          delay: 0.1,
          ease: "power2.inOut",
          onComplete: () => setHidden(true),
        });
      }

      return true;
    };

    if (!tryConnect()) {
      mo = new MutationObserver(() => {
        if (tryConnect()) mo?.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      ro?.disconnect();
      mo?.disconnect();
    };
  }, [isLoaderPage]);

  // Відео лоадер (тільки для першого / незакешованого візиту)
  useEffect(() => {
    if (!isLoaderPage || isCached) return;

    const video = videoRef.current;
    const overlay = overlayRef.current;
    const circle = circleRef.current;
    if (!video || !overlay || !circle) return;

    let heroReady = false;
    let isWaitingAtHalf = false;

    const doFadeOut = () => {
      window.removeEventListener(HERO_READY_EVENT, onHeroReady);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => setHidden(true),
      });
    };

    const markHeroReady = () => {
      heroReady = true;
      if (isWaitingAtHalf) {
        isWaitingAtHalf = false;
        void video.play();
      }
    };

    const onHeroReady = () => {
      markHeroReady();
    };

    window.addEventListener(HERO_READY_EVENT, onHeroReady);

    const heroWindow = window as Window & { __voytHeroReady?: boolean };
    if (heroWindow.__voytHeroReady) markHeroReady();

    const checkPauseAtHalf = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const targetTime = video.duration * 0.5;
      if (video.currentTime >= targetTime && !heroReady && !isWaitingAtHalf) {
        video.pause();
        isWaitingAtHalf = true;
      }
    };

    video.addEventListener("timeupdate", checkPauseAtHalf);
    video.addEventListener("durationchange", checkPauseAtHalf);
    video.addEventListener("ended", doFadeOut, { once: true });

    const fallbackTimer = setTimeout(markHeroReady, 15000);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        heroReady = true;
        doFadeOut();
      });
    }

    return () => {
      video.removeEventListener("timeupdate", checkPauseAtHalf);
      video.removeEventListener("durationchange", checkPauseAtHalf);
      video.removeEventListener("ended", doFadeOut);
      clearTimeout(fallbackTimer);
      window.removeEventListener(HERO_READY_EVENT, onHeroReady);
    };
  }, [isLoaderPage, isCached]);

  if (!isLoaderPage || hidden) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.circleWrapper} ref={circleWrapperRef}>
        <div ref={circleRef} className={styles.circle}>
          {isCached ? (
            <Image
              src="/voytCirclelogo.svg"
              alt="Voyt"
              fill
              className={styles.staticLogo}
              priority
            />
          ) : (
            <video
              ref={videoRef}
              className={styles.video}
              src="/siteLoader.mp4"
              muted
              playsInline
            />
          )}
        </div>
        {!isCached && <p className={styles.loadingLabel}>Loading assets</p>}
      </div>
    </div>
  );
}
