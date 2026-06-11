"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "@/app/art/[[...artistId]]/art.module.scss";

export default function ArtHero({
  leftAuthorId,
  rightAuthorId,
  artistParam,
}: {
  leftAuthorId: number;
  rightAuthorId: number;
  artistParam: string | null;
}) {
  const heroRef            = useRef<HTMLDivElement>(null);
  const sliderWrapperRef   = useRef<HTMLDivElement>(null);
  const swipeIndicatorRef  = useRef<HTMLDivElement>(null);
  const pullTabRef         = useRef<HTMLButtonElement>(null);
  const leftTextRef        = useRef<HTMLDivElement>(null);
  const rightTextRef       = useRef<HTMLDivElement>(null);
  const touchStartXRef     = useRef(0);
  const isMobileRef        = useRef(false);
  const animatingRef       = useRef(false);
  const prevArtistRef      = useRef<string | null>(artistParam);
  const [leftHovered, setLeftHovered]   = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  const router = useRouter();
  const isArtistSelected = !!artistParam;

  // ── Початковий стан ─────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    isMobileRef.current = window.innerWidth <= 899;
    const isMobile = isMobileRef.current;

    if (isMobile) {
      gsap.set(sliderWrapperRef.current, { x: "-50vw" });
      gsap.set([leftTextRef.current, rightTextRef.current], { opacity: 0, y: 20 });
    }

    if (isArtistSelected) {
      gsap.set(heroRef.current, { y: "-100vh" });
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Реакція на зміну artistParam (в т.ч. кнопка Назад у браузері) ──────────
  useEffect(() => {
    const prev = prevArtistRef.current;
    const curr = artistParam;
    if (prev === curr) return;
    prevArtistRef.current = curr;

    // Якщо анімацію вже запустили вручну (click) — пропускаємо
    if (animatingRef.current) {
      animatingRef.current = false;
      return;
    }

    const isMobile = isMobileRef.current;

    if (curr) {
      document.body.style.overflow = "";
      gsap.to(heroRef.current, { y: "-100vh", duration: 1, ease: "power2.inOut" });
    } else {
      document.body.style.overflow = "hidden";
      if (isMobile) {
        gsap.set(sliderWrapperRef.current, { x: "-50vw" });
        gsap.set([leftTextRef.current, rightTextRef.current], { opacity: 0, y: 20 });
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.display = "";
          swipeIndicatorRef.current.style.animation = "";
          gsap.fromTo(
            swipeIndicatorRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" },
          );
        }
      }
      gsap.to(heroRef.current, { y: 0, duration: 1, ease: "power2.inOut" });
    }
  }, [artistParam]);

  // ── Клік по колонці → галерея ───────────────────────────────────────────────
  const handleSelectArtist = (authorId: number) => {
    if (isArtistSelected) return;
    animatingRef.current = true;
    document.body.style.overflow = "";
    gsap.to(heroRef.current, { y: "-100vh", duration: 1, ease: "power2.inOut" });
    router.push("/art?artist=" + authorId);
  };

  // ── Кнопка повернення ───────────────────────────────────────────────────────
  const handleBack = () => {
    animatingRef.current = true;
    document.body.style.overflow = "hidden";

    if (isMobileRef.current) {
      gsap.set(sliderWrapperRef.current, { x: "-50vw" });
      gsap.set([leftTextRef.current, rightTextRef.current], { opacity: 0, y: 20 });
      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.style.display = "";
        swipeIndicatorRef.current.style.animation = "";
        gsap.fromTo(
          swipeIndicatorRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" },
        );
      }
    }

    gsap.to(heroRef.current, { y: 0, duration: 1, ease: "power2.inOut" });
    router.push("/art");
  };

  // ── Swipe обробники ─────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const delta = touch.clientX - touchStartXRef.current;
    if (Math.abs(delta) < 40) return;

    if (swipeIndicatorRef.current) swipeIndicatorRef.current.style.animation = "none";
    gsap.to(swipeIndicatorRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.35,
      onComplete: () => {
        if (swipeIndicatorRef.current) swipeIndicatorRef.current.style.display = "none";
      },
    });

    if (delta > 0) {
      gsap.to(sliderWrapperRef.current, {
        x: 0,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () =>
          gsap.to(leftTextRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
      });
    } else {
      gsap.to(sliderWrapperRef.current, {
        x: "-100vw",
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () =>
          gsap.to(rightTextRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
      });
    }
  };

  return (
    <div
      ref={heroRef}
      className={styles.hero}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slider wrapper (200vw) ── */}
      <div className={styles.sliderClip}>
      <div ref={sliderWrapperRef} className={styles.sliderWrapper}>

        {/* Ліва колонка — перший автор */}
        <div className={styles.column} onClick={() => handleSelectArtist(leftAuthorId)}>
          <div className={styles.colBgLeft} />
          <div className={`${styles.colOverlay} ${leftHovered ? styles.colOverlayHidden : ""}`} />

          <div
            className={styles.portraitWrapLeft}
            onMouseEnter={() => setLeftHovered(true)}
            onMouseLeave={() => setLeftHovered(false)}
          >
            <Image
              src="/artPageAssets/Ivanka.png"
              alt="Ivanka Voyt"
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className={styles.portraitImg}
            />
          </div>

          <div ref={leftTextRef} className={`${styles.colText} ${leftHovered ? styles.colTextHidden : ""}`}>
            <h2 className={styles.colName}>Ivanka</h2>
            <p className={styles.colDesc}>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Права колонка — другий автор */}
        <div
          className={`${styles.column} ${styles.columnRight}`}
          onClick={() => handleSelectArtist(rightAuthorId)}
        >
          <div className={styles.colBgRight} />
          <div className={`${styles.colOverlay} ${rightHovered ? styles.colOverlayHidden : ""}`} />

          <div
            className={styles.portraitWrapRight}
            onMouseEnter={() => setRightHovered(true)}
            onMouseLeave={() => setRightHovered(false)}
          >
            <Image
              src="/artPageAssets/Sasha.png"
              alt="Oleksander Voyt"
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className={styles.portraitImg}
            />
          </div>

          <div ref={rightTextRef} className={`${styles.colText} ${styles.colTextRight} ${rightHovered ? styles.colTextHidden : ""}`}>
            <h2 className={styles.colName}>Oleksander</h2>
            <p className={styles.colDesc}>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

      </div>
      </div>

      {/* ── Swipe indicator (тільки мобільний) ── */}
      <div ref={swipeIndicatorRef} className={styles.swipeIndicator}>
        <span className={styles.swipeArrow}>←</span>
        <span className={styles.swipeText}>swipe</span>
        <span className={styles.swipeArrow}>→</span>
      </div>

      {/* ── Pull-tab ── */}
      <button
        ref={pullTabRef}
        className={styles.pullTab}
        onClick={handleBack}
        aria-label="Повернутися до вибору художника"
      >
        <svg
          className={styles.pullTabIcon}
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
        >
          <path
            d="M1 1L10 10L19 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}


