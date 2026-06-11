"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import styles from "./PageLoader.module.scss";

// ══════════════════════════════════════════════════════════════════════════════
// PageLoader — екран завантаження сторінки
// • Чорний fullscreen оверлей з круглим відео по центру
// • Коло обтинає кути відео (border-radius: 50% + overflow: hidden)
// • Після закінчення відео → reveal анімація (коло розширюється → оверлей зникає)
//
// ★ LOADER_PAGES — список сторінок де лоадер показується.
//   Щоб додати сторінку — просто додай рядок до масиву, наприклад "/gallery"
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

  // ── Синхронізація позиції circleWrapper з heroContent ──────────────────────
  // Hero компонент — lazy import, може з'явитися пізніше ніж PageLoader.
  // MutationObserver — чекає появи #hero-content в DOM.
  // ResizeObserver — оновлює позицію при resize вікна.
  useEffect(() => {
    if (!isLoaderPage) return;

    const wrapper = circleWrapperRef.current;
    if (!wrapper) return;

    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;

    // getBoundingClientRect повертає позицію відносно візуального viewport.
    // position:fixed теж прив'язаний до візуального viewport.
    // Тому цей підхід точний навіть коли адресний рядок мобільного браузера видимий.
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
      // Показуємо коло тільки після того як позиція встановлена — без флешу
      const circle = circleRef.current;
      if (circle) gsap.to(circle, { opacity: 1, duration: 0.2, ease: "none" });
      ro = new ResizeObserver(() => syncPosition(heroContent));
      ro.observe(heroContent);
      return true;
    };

    if (!tryConnect()) {
      // Hero ще не змонтовано — чекаємо появи #hero-content
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

  useEffect(() => {
    if (!isLoaderPage) return;

    const video = videoRef.current;
    const overlay = overlayRef.current;
    const circle = circleRef.current;
    if (!video || !overlay || !circle) return;

    let heroReady = false;
    let isWaitingAtHalf = false;

    // ── 1. Fade-out — викликається ТІЛЬКИ через подію "ended" ─────────────────
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

    // Ставимо loader-ролик на паузу на 50%, поки hero не стане ready.
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

    // Fallback: через 15с примусово знімаємо паузу і відпускаємо на сайт.
    // Якщо подія hero-ready не прийшла (помилка кадрів/скрипта), не тримаємо користувача.
    const fallbackTimer = setTimeout(markHeroReady, 15000);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Автовідтворення заблоковано (напр. iOS Low Power Mode) → ревіл одразу
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
  }, [isLoaderPage]);

  if (!isLoaderPage || hidden) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.circleWrapper} ref={circleWrapperRef}>
        <div ref={circleRef} className={styles.circle}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/siteLoader.mp4"
            muted
            playsInline
            // autoPlay НЕ використовуємо — запускаємо через .play() в useEffect
            // для кращої сумісності з мобільними браузерами
          />
        </div>
        <p className={styles.loadingLabel}>Loading asets</p>
      </div>
    </div>
  );
}
