"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import styles from "@/app/art/[[...artistId]]/art.module.scss";

// ── Мок-дані авторів для нової Hero-секції ─────────────────────────────────────
const MOCK_AUTHORS = [
  {
    id: 1, // Ivanka (Real ID in Database)
    firstName: "Ivanka",
    lastName: "Voyt",
    bio: "Роботи Іванки Войт відрізняються глибокою чуттєвістю, експресивними мазками та унікальною текстурою полотна.",
    photoUrl: "/artPageAssets/Ivanka.png",
    bgPhotoUrl: "/artPageAssets/IvankaBackground.jpg",
    styleConfig: { x: 35, width: 55, textAlignment: "right" as const }
  },
  {
    id: 2, // Oleksander (Real ID in Database)
    firstName: "Oleksander",
    lastName: "Voyt",
    bio: "Олександр Войт досліджує межі кольору та світла, створюючи монументальні абстрактні композиції.",
    photoUrl: "/artPageAssets/Sasha.png",
    bgPhotoUrl: "/artPageAssets/SashaBackground.jpg",
    styleConfig: { x: 65, width: 55, textAlignment: "left" as const }
  },
  {
    id: 3, // Mock Artist 3
    firstName: "Марія",
    lastName: "Коваль",
    bio: "Марія Коваль поєднує українські традиційні орнаменти з сучасними цифровими медіа та колажем.",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    bgPhotoUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    styleConfig: { x: 50, width: 45, textAlignment: "right" as const }
  },
  {
    id: 4, // Mock Artist 4
    firstName: "Дмитро",
    lastName: "Петренко",
    bio: "Дмитро Петренко фокусується на темах урбанізму, створюючи неонові картини-інсталяції.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    bgPhotoUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1200&auto=format&fit=crop",
    styleConfig: { x: 50, width: 45, textAlignment: "left" as const }
  }
];

export default function ArtHero({
  artistParam,
}: {
  artistParam: string | null;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const swipeIndicatorRef = useRef<HTMLDivElement>(null);
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const isNeon = searchParams.get("neon") === "true";
  const isArtistSelected = !!artistParam;

  // ── Початковий стан ─────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    isMobileRef.current = window.innerWidth <= 899;
    const isMobile = isMobileRef.current;

    if (isMobile) {
      // Початково центруємо перший слайд на мобільних
      gsap.set(sliderWrapperRef.current, { x: "0vw" });
      setActiveMobileIndex(0);
    } else {
      // Скидаємо X позицію на десктопі
      gsap.set(sliderWrapperRef.current, { x: "0vw" });
      currentXVw.current = 0;
    }

    if (isArtistSelected) {
      gsap.set(heroRef.current, { y: "-100vh" });
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isArtistSelected]);

  // ── Реакція на зміну скролу коліщатком миші (h-scroll для десктопу) ───────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isArtistSelected) return; // не скролимо, якщо відкрита галерея
      if (isMobileRef.current) return; // вимикаємо на мобілках

      // Скасовуємо стандартний вертикальний скрол сторінки
      e.preventDefault();

      const delta = e.deltaY || e.deltaX;
      // Чутливість скролу
      let nextX = currentXVw.current + delta * 0.04;

      // Максимальний зсув слайдера (кількість авторів * 33.33vw - 100vw)
      const maxTranslateVw = Math.max(0, MOCK_AUTHORS.length * 33.333 - 100);

      if (nextX < 0) nextX = 0;
      if (nextX > maxTranslateVw) nextX = maxTranslateVw;

      currentXVw.current = nextX;

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
  }, [isArtistSelected]);

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
      if (isMobile) {
        gsap.set(sliderWrapperRef.current, { x: "0vw" });
        setActiveMobileIndex(0);
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.display = "";
          swipeIndicatorRef.current.style.animation = "";
          gsap.fromTo(
            swipeIndicatorRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" },
          );
        }
      } else {
        gsap.set(sliderWrapperRef.current, { x: "0vw" });
        currentXVw.current = 0;
      }
      gsap.to(heroRef.current, { y: 0, duration: 1, ease: "power2.inOut" });
    }
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

    if (isMobileRef.current) {
      gsap.set(sliderWrapperRef.current, { x: "0vw" });
      setActiveMobileIndex(0);
      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.style.display = "";
        swipeIndicatorRef.current.style.animation = "";
        gsap.fromTo(
          swipeIndicatorRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" },
        );
      }
    } else {
      gsap.set(sliderWrapperRef.current, { x: "0vw" });
      currentXVw.current = 0;
    }

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

    if (swipeIndicatorRef.current) swipeIndicatorRef.current.style.animation = "none";
    gsap.to(swipeIndicatorRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.35,
      onComplete: () => {
        if (swipeIndicatorRef.current) swipeIndicatorRef.current.style.display = "none";
      },
    });

    let newIndex = activeMobileIndex;
    if (delta > 0) {
      // свайп вправо -> гортаємо назад
      if (newIndex > 0) newIndex--;
    } else {
      // свайп вліво -> гортаємо вперед
      if (newIndex < MOCK_AUTHORS.length - 1) newIndex++;
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
          style={{ width: `${MOCK_AUTHORS.length * 33.333}vw` }}
        >
          {MOCK_AUTHORS.map((author, index) => {
            const config = author.styleConfig;
            const isExternal = author.photoUrl.startsWith("http");
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={author.id}
                className={`${styles.column} ${
                  loadingArtistId === author.id ? styles.loadingColumn : ""
                }`}
                onClick={() => handleSelectArtist(author.id)}
                onMouseEnter={() => !isMobileRef.current && setHoveredIndex(index)}
                onMouseLeave={() => !isMobileRef.current && setHoveredIndex(null)}
              >
                {/* Фонове зображення карти */}
                <div
                  className={styles.colBg}
                  style={{
                    backgroundImage: `url(${author.bgPhotoUrl})`,
                  }}
                />

                {/* Затемнюючий оверлей */}
                <div
                  className={`${styles.colOverlay} ${
                    isHovered ? styles.colOverlayHidden : ""
                  }`}
                />

                {/* Контейнер силуету/портрета автора */}
                <div
                  className={`${styles.portraitWrap} ${
                    isExternal ? styles.portraitCard : ""
                  }`}
                  style={{
                    left: `${config.x}%`,
                    width: `${config.width}%`,
                  }}
                >
                  <Image
                    src={author.photoUrl}
                    alt={`${author.firstName} ${author.lastName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className={`${styles.portraitImg} ${
                      isHovered ? styles.portraitImgHover : ""
                    }`}
                    priority={index < 3}
                  />
                </div>

                {/* Текст (опис та ім'я) */}
                <div
                  className={`${styles.colText} ${
                    config.textAlignment === "left" ? styles.colTextLeft : styles.colTextRight
                  } ${isHovered ? styles.colTextHidden : ""}`}
                >
                  <h2 className={styles.colName}>{author.firstName}</h2>
                  <p className={styles.colDesc}>{author.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Swipe indicator (мобільний) ── */}
      <div ref={swipeIndicatorRef} className={styles.swipeIndicator}>
        <span className={styles.swipeArrow}>←</span>
        <span className={styles.swipeText}>swipe</span>
        <span className={styles.swipeArrow}>→</span>
      </div>

      {/* ── Крапки-індикатори для мобілок ── */}
      <div className={styles.dotsContainer}>
        {MOCK_AUTHORS.map((_, index) => (
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



