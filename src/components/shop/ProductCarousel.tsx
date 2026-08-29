"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCarousel.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useTranslation, useLanguage } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";

export type CarouselItem = {
  id: number;
  title: string;
  titleUk?: string | null;
  price: number;
  stock: number;
  coverUrl?: string | null;
  images?: { id: number; url: string; order: number }[];
  author?: { firstName: string; firstNameUk?: string | null; lastName: string; lastNameUk?: string | null } | null;
  category?: { id: number; name: string; nameUk?: string | null; slug: string } | null;
};

interface ProductCarouselProps<T extends CarouselItem = CarouselItem> {
  title: string;
  products: T[];
  onProductClick?: (product: T) => void;
  onAddToCart: (product: T) => void;
}

export default function ProductCarousel<T extends CarouselItem = CarouselItem>({
  title,
  products,
  onAddToCart,
}: ProductCarouselProps<T>) {
  const { t, locale } = useTranslation();
  const { getLocalizedHref } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [progressRatio, setProgressRatio] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(30);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const prevTranslateRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Отримуємо метрики слайдера (крок, макс. зсув, загальна ширина та ширина в'юпорта)
  const getSlideMetrics = useCallback(() => {
    if (!trackRef.current || !viewportRef.current) {
      return { step: 300, maxTranslate: 0, totalWidth: 0, viewportWidth: 0 };
    }
    const slide = trackRef.current.querySelector<HTMLElement>(`.${styles.slide}`);
    if (!slide) {
      return { step: 300, maxTranslate: 0, totalWidth: 0, viewportWidth: 0 };
    }

    const isMobile = window.innerWidth <= 640;
    const gap = isMobile ? 12 : 16;
    const slideWidth = slide.offsetWidth;
    const step = slideWidth + gap;

    const totalWidth = products.length * step - gap;
    const viewportWidth = viewportRef.current.offsetWidth;
    const maxTranslate = Math.max(0, totalWidth - viewportWidth);

    return { step, maxTranslate, totalWidth, viewportWidth };
  }, [products.length]);

  // Оновлюємо розмір повзунка прогрес-бару
  const updateThumbMetrics = useCallback(() => {
    const { totalWidth, viewportWidth, maxTranslate } = getSlideMetrics();
    if (totalWidth > 0 && viewportWidth > 0) {
      const calculatedWidth = Math.max(15, Math.min(100, (viewportWidth / totalWidth) * 100));
      setThumbWidthPercent(calculatedWidth);
      if (maxTranslate > 0) {
        setProgressRatio(Math.min(1, Math.max(0, Math.abs(currentTranslateRef.current) / maxTranslate)));
      } else {
        setProgressRatio(0);
      }
    }
  }, [getSlideMetrics]);

  // Встановлення позиції треку через GPU-transform
  const setTrackPosition = useCallback((translatePx: number, animated = true) => {
    if (!trackRef.current) return;
    if (animated) {
      trackRef.current.style.transition = "transform 420ms cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
      trackRef.current.style.transition = "none";
    }
    trackRef.current.style.transform = `translate3d(${translatePx}px, 0, 0)`;
  }, []);

  // Перехід до конкретного слайду
  const goToSlide = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(products.length - 1, index));
      const { step, maxTranslate } = getSlideMetrics();
      let targetTranslate = -(clampedIndex * step);

      if (maxTranslate > 0 && Math.abs(targetTranslate) > maxTranslate) {
        targetTranslate = -maxTranslate;
      }

      currentTranslateRef.current = targetTranslate;
      prevTranslateRef.current = targetTranslate;
      setTrackPosition(targetTranslate, true);
      setActiveIndex(clampedIndex);

      if (maxTranslate > 0) {
        setProgressRatio(Math.min(1, Math.max(0, Math.abs(targetTranslate) / maxTranslate)));
      } else {
        setProgressRatio(0);
      }
    },
    [products.length, getSlideMetrics, setTrackPosition]
  );

  // ── Скидання та перезапуск автотаймера (8 секунд) ──
  const resetAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (!products || products.length <= 1) return;

    autoplayTimerRef.current = setInterval(() => {
      if (isPointerDownRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % products.length;
        goToSlide(next);
        return next;
      });
    }, 8000);
  }, [products, goToSlide]);

  // Навігація стрілочками
  const scroll = useCallback(
    (direction: "left" | "right") => {
      if (!products.length) return;
      const { maxTranslate } = getSlideMetrics();
      
      // На десктопі, якщо вже в кінці, повертаємось на початок
      if (direction === "right") {
        if (Math.abs(currentTranslateRef.current) >= maxTranslate - 5) {
          goToSlide(0);
        } else {
          goToSlide(activeIndex + 1);
        }
      } else {
        if (activeIndex <= 0 && Math.abs(currentTranslateRef.current) <= 5) {
          goToSlide(products.length - 1);
        } else {
          goToSlide(activeIndex - 1);
        }
      }
      resetAutoplayTimer();
    },
    [activeIndex, products.length, getSlideMetrics, goToSlide, resetAutoplayTimer]
  );

  // Ініціалізація автотаймера та розрахунок розмірів
  useEffect(() => {
    resetAutoplayTimer();
    updateThumbMetrics();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [resetAutoplayTimer, updateThumbMetrics]);

  // Синхронізація при зміні розміру вікна
  useEffect(() => {
    const handleResize = () => {
      goToSlide(activeIndex);
      updateThumbMetrics();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, goToSlide, updateThumbMetrics]);

  // ── Тачпад (Wheel & Trackpad 2-finger horizontal swipe) ──
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let wheelSettleTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // If user is scrolling vertically, do not intercept or block page scroll!
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && !e.shiftKey) {
        return;
      }

      const deltaX = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      
      // Якщо жест горизонтальний (наприклад свайп двома пальцями на тачпаді)
      if (Math.abs(deltaX) > 2) {
        e.preventDefault();
        resetAutoplayTimer();

        const { maxTranslate, step } = getSlideMetrics();
        if (maxTranslate <= 0) return;

        let newTranslate = currentTranslateRef.current - deltaX * 1.1;

        // Пружний опір при виході за межі
        if (newTranslate > 0) {
          newTranslate = newTranslate * 0.25;
        } else if (Math.abs(newTranslate) > maxTranslate) {
          const excess = Math.abs(newTranslate) - maxTranslate;
          newTranslate = -maxTranslate - excess * 0.25;
        }

        currentTranslateRef.current = newTranslate;
        prevTranslateRef.current = newTranslate;
        setTrackPosition(newTranslate, false);

        // Оновлення прогресу
        const progress = Math.min(1, Math.max(0, Math.abs(newTranslate) / maxTranslate));
        setProgressRatio(progress);

        const closestIndex = Math.round(Math.abs(newTranslate) / step);
        setActiveIndex(Math.max(0, Math.min(products.length - 1, closestIndex)));

        // Плавне повернення в межі після завершення прокрутки
        if (wheelSettleTimer) clearTimeout(wheelSettleTimer);
        wheelSettleTimer = setTimeout(() => {
          if (currentTranslateRef.current > 0) {
            goToSlide(0);
          } else if (Math.abs(currentTranslateRef.current) > maxTranslate) {
            const { maxTranslate: maxT } = getSlideMetrics();
            currentTranslateRef.current = -maxT;
            prevTranslateRef.current = -maxT;
            setTrackPosition(-maxT, true);
          }
        }, 120);
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      if (wheelSettleTimer) clearTimeout(wheelSettleTimer);
    };
  }, [getSlideMetrics, goToSlide, products.length, resetAutoplayTimer, setTrackPosition]);

  // ── Unified Swiper Gestures (Touch & Mouse Drag) ──
  const onDragStart = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = clientX;
    startYRef.current = clientY;
    startTimeRef.current = performance.now();
    setTrackPosition(prevTranslateRef.current, false);
    setIsGrabbing(true);
    resetAutoplayTimer();
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current) return;
    const deltaX = clientX - startXRef.current;
    const deltaY = clientY - startYRef.current;

    // Відсікаємо випадковий вертикальний скрол
    if (Math.abs(deltaY) > Math.abs(deltaX) && !isDraggingRef.current) {
      return;
    }

    if (Math.abs(deltaX) > 6) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      const { maxTranslate } = getSlideMetrics();
      let current = prevTranslateRef.current + deltaX;

      // Пружний опір на краях (Rubber-band physics)
      if (current > 0) {
        current = deltaX * 0.3;
      } else if (Math.abs(current) > maxTranslate) {
        const excess = Math.abs(current) - maxTranslate;
        current = -maxTranslate - excess * 0.3;
      }

      currentTranslateRef.current = current;
      setTrackPosition(current, false);

      if (maxTranslate > 0) {
        setProgressRatio(Math.min(1, Math.max(0, Math.abs(current) / maxTranslate)));
      }
    }
  };

  const onDragEnd = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsGrabbing(false);

    if (isDraggingRef.current) {
      const deltaX = currentTranslateRef.current - prevTranslateRef.current;
      const elapsedTime = performance.now() - startTimeRef.current;
      const velocity = deltaX / (elapsedTime || 1);
      const { step } = getSlideMetrics();

      let targetIndex = activeIndex;

      // Швидкий флік або свайп більше 20% ширини
      if (Math.abs(velocity) > 0.25 || Math.abs(deltaX) > step * 0.2) {
        if (deltaX < 0) {
          targetIndex = activeIndex + 1;
        } else {
          targetIndex = activeIndex - 1;
        }
      }

      goToSlide(targetIndex);
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 60);
    } else {
      goToSlide(activeIndex);
    }

    resetAutoplayTimer();
  };

  // Клік по десктопному прогрес-бару для швидкого переходу
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const { maxTranslate, step } = getSlideMetrics();
    const targetTranslate = -(ratio * maxTranslate);
    const closestIndex = Math.round(Math.abs(targetTranslate) / step);
    goToSlide(closestIndex);
    resetAutoplayTimer();
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) onDragStart(t.clientX, t.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) onDragMove(t.clientX, t.clientY);
  };
  const handleTouchEnd = () => {
    onDragEnd();
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    onDragMove(e.clientX, e.clientY);
  };
  const handleMouseUpOrLeave = () => {
    if (isPointerDownRef.current) onDragEnd();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!products || products.length === 0) return null;

  // Розрахунок позиції повзунка
  const thumbOffset = progressRatio * (100 - thumbWidthPercent);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => { resetAutoplayTimer(); }}
      onMouseLeave={() => { resetAutoplayTimer(); }}
    >
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.counterBadge}>
            {activeIndex + 1} / {products.length}
          </span>
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.button}
            aria-label="Previous products"
            onClick={() => scroll("left")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9L2 5L6 1" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.button}
            aria-label="Next products"
            onClick={() => scroll("right")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9L8 5L4 1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Viewport з тачпадом, мишкою та тачем ── */}
      <div
        className={`${styles.viewport} ${isGrabbing ? styles.isGrabbing : ""}`}
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
      >
        <div className={styles.track} ref={trackRef}>
          {products.map((product, index) => {
            const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
            const coverImg = rawUrl ? getOptimizedImageUrl(rawUrl, { preset: "card" }) : "/voyt.svg";
            const productHref = getLocalizedHref(`/shop/${product.id}`);
            const localizedTitle = getLocalized(product, "title", locale);
            const authorFirstName = product.author ? getLocalized(product.author, "firstName", locale) : "";
            const authorLastName = product.author ? getLocalized(product.author, "lastName", locale) : "";
            const authorFullName = product.author ? `${authorFirstName} ${authorLastName}`.trim() : "";

            return (
              <div key={product.id} className={styles.slide}>
                <div className={styles.productCard}>
                  <Link href={productHref} className={styles.imageWrapper} draggable={false}>
                    <Image
                      src={coverImg}
                      alt={localizedTitle}
                      fill
                      priority={index < 2}
                      className={styles.productImage}
                      sizes="(max-width: 640px) 100vw, 300px"
                      draggable={false}
                    />
                    {product.stock <= 0 && <div className={styles.soldOut}>{t("shop.soldOut")}</div>}
                  </Link>

                  <div className={styles.cardInfo}>
                    <p className={styles.authorName}>
                      {authorFullName}
                    </p>
                    <Link href={productHref} style={{ textDecoration: "none", color: "inherit" }} draggable={false}>
                      <h3 className={styles.productTitle}>
                        {localizedTitle}
                      </h3>
                    </Link>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>{product.price.toLocaleString("en-US")} €</span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={styles.addToCartBtn}
                      >
                        {product.stock <= 0 ? t("shop.soldOut") : t("shop.addToCart")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Десктопний прогрес-бар (Desktop Progress Track) ── */}
      <div className={styles.desktopProgressWrapper}>
        <div
          className={styles.progressTrack}
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={Math.round(progressRatio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Carousel scroll progress"
        >
          <div
            className={styles.progressBar}
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbOffset}%`,
            }}
          />
        </div>
      </div>

      {/* ── Крапочки індикатора слайдів для мобільних (Mobile Dots) ── */}
      {products.length > 1 && (
        <div className={styles.dotsWrapper} aria-label="Carousel pagination">
          {products.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              onClick={() => {
                goToSlide(idx);
                resetAutoplayTimer();
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

