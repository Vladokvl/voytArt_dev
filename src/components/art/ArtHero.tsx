"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import styles from "@/app/art/[[...artistId]]/art.module.scss";

type DBAuthor = {
  id: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  shortDesc: string | null;
  photoUrl: string | null;
  bgPhotoUrl: string | null;
  order: number;
  active: boolean;
};

const DEFAULT_BG_PHOTOS = [
  "/artPageAssets/IvankaBackground.jpg",
  "/artPageAssets/SashaBackground.jpg"
];

const DEFAULT_PORTRAIT_PHOTOS = [
  "/artPageAssets/Ivanka.png",
  "/artPageAssets/Sasha.png"
];

export default function ArtHero({
  artistParam,
  authors = []
}: {
  artistParam: string | null;
  authors: DBAuthor[];
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const pullTabRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef(0);
  const isMobileRef = useRef(false);
  const animatingRef = useRef(false);
  const prevArtistRef = useRef<string | null>(artistParam);
  
  // Позиція скролу десктопного слайдера (у vw)
  const currentXVw = useRef(0);

  // Стан наведення на картку (індекс)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Активний слайд на мобільних пристроях
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [loadingArtistId, setLoadingArtistId] = useState<number | null>(null);

  // Прогрес скролу на десктопі (від 0 до 100)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isNeon = searchParams.get("neon") === "true";
  const isArtistSelected = !!artistParam;

  // ── Початковий стан ─────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    isMobileRef.current = window.innerWidth <= 899;
    const isMobile = isMobileRef.current;
    setIsMobileState(isMobile);

    if (authors.length === 0) return;

    // Визначаємо початковий індекс автора (якщо відкритий через URL)
    const initialArtistId = Number(artistParam);
    const initialIndex = initialArtistId ? authors.findIndex(a => a.id === initialArtistId) : 0;
    const startIndex = initialIndex >= 0 ? initialIndex : 0;

    if (isMobile) {
      gsap.set(sliderWrapperRef.current, { x: `-${startIndex * 100}vw` });
      setActiveMobileIndex(startIndex);
    } else {
      const maxTranslateVw = Math.max(0, authors.length * 33.333 - 100);
      let targetXVw = startIndex * 33.333;
      if (targetXVw > maxTranslateVw) targetXVw = maxTranslateVw;

      gsap.set(sliderWrapperRef.current, { x: `-${targetXVw}vw` });
      currentXVw.current = targetXVw;
      setScrollProgress(maxTranslateVw > 0 ? (targetXVw / maxTranslateVw) * 100 : 0);
    }

    if (isArtistSelected) {
      gsap.set(heroRef.current, { y: "-100vh" });
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Реакція на зміну скролу коліщатком миші (h-scroll для десктопу) ───────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isArtistSelected) return; // не скролимо, якщо відкрита галерея
      if (isMobileRef.current) return; // вимикаємо на мобілках
      if (authors.length === 0) return;

      // Скасовуємо стандартний вертикальний скрол сторінки
      e.preventDefault();

      const delta = e.deltaY || e.deltaX;
      // Чутливість скролу
      let nextX = currentXVw.current + delta * 0.04;

      // Максимальний зсув слайдера (кількість авторів * 33.33vw - 100vw)
      const maxTranslateVw = Math.max(0, authors.length * 33.333 - 100);

      if (nextX < 0) nextX = 0;
      if (nextX > maxTranslateVw) nextX = maxTranslateVw;

      currentXVw.current = nextX;

      // Оновлюємо відсоток прогресу для лінії індикатора
      const progress = maxTranslateVw > 0 ? (nextX / maxTranslateVw) * 100 : 0;
      setScrollProgress(progress);

      gsap.to(sliderWrapperRef.current, {
        x: `-${nextX}vw`,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const heroElement = heroRef.current;
    if (heroElement && !isArtistSelected) {
      heroElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isArtistSelected, authors]);

  // ── Реакція на зміну artistParam (в т.ч. навігація кнопками браузера) ─────────
  useEffect(() => {
    const prev = prevArtistRef.current;
    const curr = artistParam;
    if (prev === curr) return;
    prevArtistRef.current = curr;

    setLoadingArtistId(null);

    if (animatingRef.current) {
      animatingRef.current = false;
      return;
    }

    const isMobile = isMobileRef.current;

    if (curr) {
      document.body.style.overflow = "";
      gsap.to(heroRef.current, { y: "-100vh", duration: 1, delay: 0.15, ease: "power2.inOut" });
    } else {
      document.body.style.overflow = "hidden";
      // При поверненні назад відновлюємо ту позицію слайдера, яка збережена в стані/рефі
      if (isMobile) {
        gsap.set(sliderWrapperRef.current, { x: `-${activeMobileIndex * 100}vw` });
      } else {
        gsap.set(sliderWrapperRef.current, { x: `-${currentXVw.current}vw` });
      }
      gsap.to(heroRef.current, { y: 0, duration: 1, ease: "power2.inOut" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistParam]);

  // ── Клік по колонці автора ──────────────────────────────────────────────────
  const handleSelectArtist = (authorId: number) => {
    if (isArtistSelected) return;
    setLoadingArtistId(authorId);
    animatingRef.current = false;
    const params = new URLSearchParams();
    params.set("artist", String(authorId));
    if (isNeon) params.set("neon", "true");
    router.push("/art?" + params.toString());
  };

  // ── Кнопка повернення (шторка вниз) ─────────────────────────────────────────
  const handleBack = () => {
    animatingRef.current = true;
    document.body.style.overflow = "hidden";

    // НЕ скидаємо координати в 0 при натисканні назад — залишаємо слайдер у поточному стані

    gsap.to(heroRef.current, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        const params = new URLSearchParams();
        if (isNeon) params.set("neon", "true");
        const queryStr = params.toString();
        router.push("/art" + (queryStr ? "?" + queryStr : ""));
      }
    });
  };

  // ── Swipe обробники для мобільних ──────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isArtistSelected) return;
    touchStartXRef.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isArtistSelected) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const delta = touch.clientX - touchStartXRef.current;
    if (Math.abs(delta) < 40) return;

    let newIndex = activeMobileIndex;
    if (delta > 0) {
      // свайп вправо -> гортаємо назад
      if (newIndex > 0) newIndex--;
    } else {
      // свайп вліво -> гортаємо вперед
      if (newIndex < authors.length - 1) newIndex++;
    }

    setActiveMobileIndex(newIndex);
    gsap.to(sliderWrapperRef.current, {
      x: `-${newIndex * 100}vw`,
      duration: 0.45,
      ease: "power2.inOut",
    });
  };

  const handleDotClick = (index: number) => {
    if (isArtistSelected) return;
    setActiveMobileIndex(index);
    gsap.to(sliderWrapperRef.current, {
      x: `-${index * 100}vw`,
      duration: 0.45,
      ease: "power2.inOut",
    });
  };

  if (authors.length === 0) return null;

  return (
    <div
      ref={heroRef}
      className={styles.hero}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.sliderClip}>
        <div 
          ref={sliderWrapperRef} 
          className={styles.sliderWrapper}
          style={{ width: `${authors.length * 33.333}vw` }}
        >
          {authors.map((author, index) => {
            const isHovered = isMobileState ? activeMobileIndex === index : hoveredIndex === index;

            // Визначаємо фото та фон з урахуванням дефолтних значень
            const photoUrl = author.photoUrl ?? DEFAULT_PORTRAIT_PHOTOS[index % DEFAULT_PORTRAIT_PHOTOS.length] ?? "/artPageAssets/Ivanka.png";
            const bgPhotoUrl = author.bgPhotoUrl ?? DEFAULT_BG_PHOTOS[index % DEFAULT_BG_PHOTOS.length] ?? "/artPageAssets/IvankaBackground.jpg";

            return (
              <div
                key={author.id}
                className={`${styles.column} ${
                  loadingArtistId === author.id ? styles.loadingColumn : ""
                }`}
                onClick={() => handleSelectArtist(author.id)}
                onMouseEnter={() => !isMobileState && setHoveredIndex(index)}
                onMouseLeave={() => !isMobileState && setHoveredIndex(null)}
              >
                {/* Фонове зображення карти */}
                <div
                  className={styles.colBg}
                  style={{
                    backgroundImage: `url(${bgPhotoUrl})`,
                  }}
                />

                {/* Затемнюючий оверлей */}
                <div
                  className={`${styles.colOverlay} ${
                    isHovered ? styles.colOverlayHidden : ""
                  }`}
                />

                {/* Ім'я автора зверху по центру */}
                <h2 className={styles.colName}>{author.firstName}</h2>

                {/* Біографія автора по центру */}
                <div
                  className={`${styles.colText} ${
                    isHovered ? styles.colTextVisible : ""
                  }`}
                >
                  <p className={styles.colDesc}>{author.shortDesc ?? ""}</p>
                </div>

                {/* Контейнер рамки портрета автора (зсувається вниз при ховері) */}
                <div
                  className={`${styles.portraitWrap} ${
                    isHovered ? styles.portraitWrapDown : ""
                  }`}
                >
                  <Image
                    src={photoUrl}
                    alt={`${author.firstName} ${author.lastName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className={styles.portraitImg}
                    priority={index < 3}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Лінія прогресу скролу (тільки для десктопу) ── */}
      {!isMobileRef.current && authors.length * 33.333 > 100 && (
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarActive} 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* ── Крапки-індикатори для мобілок ── */}
      <div className={styles.dotsContainer}>
        {authors.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${activeMobileIndex === index ? styles.dotActive : ""}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ── Pull-tab шторка ── */}
      <button
        ref={pullTabRef}
        className={styles.pullTab}
        onClick={handleBack}
        aria-label="Back to artist selection"
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
