"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, Autoplay, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import styles from "./ProductCarousel.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useTranslation, useLanguage } from "~/context/LanguageContext";
import { getLocalized, formatLocalizedPrice } from "~/lib/i18n";

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
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);

  if (!products || products.length === 0) {
    return null;
  }

  const thumbWidthPercent = Math.max(18, Math.min(100, (4 / products.length) * 100));
  const thumbOffset = progressRatio * (100 - thumbWidthPercent);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swiperRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    swiperRef.current.setProgress(ratio, 400);
  };

  return (
    <div className={styles.carousel}>
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
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9L2 5L6 1" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.button}
            aria-label="Next products"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9L8 5L4 1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Swiper Carousel (with smooth freeMode inertia & mobile GPU optimization) ── */}
      <div className={styles.viewport}>
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Autoplay, A11y]}
          freeMode={{
            enabled: true,
            sticky: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 0.85,
            momentumBounce: true,
          }}
          grabCursor={true}
          speed={450}
          roundLengths={true}
          watchSlidesProgress={false}
          touchAngle={45}
          nested={true}
          touchReleaseOnEdges={true}
          autoplay={
            products.length > 4
              ? {
                  delay: 8000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          breakpoints={{
            0: {
              slidesPerView: 1.15,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1.35,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            860: {
              slidesPerView: 2.7,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          onProgress={(_, progress) => {
            setProgressRatio(Math.max(0, Math.min(1, progress)));
          }}
          className={styles.swiperInstance}
        >
          {products.map((product, index) => {
            const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
            const coverImg = rawUrl ? getOptimizedImageUrl(rawUrl, { preset: "card" }) : "/voyt.svg";
            const productHref = getLocalizedHref(`/shop/${product.id}`);
            const localizedTitle = getLocalized(product, "title", locale);
            const authorFirstName = product.author ? getLocalized(product.author, "firstName", locale) : "";
            const authorLastName = product.author ? getLocalized(product.author, "lastName", locale) : "";
            const authorFullName = product.author ? `${authorFirstName} ${authorLastName}`.trim() : "";

            return (
              <SwiperSlide key={product.id} className={styles.slide}>
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
                      <span className={styles.price}>{formatLocalizedPrice(product.price, locale)}</span>
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ── Десктопний прогрес-бар (Desktop Progress Track) ── */}
      {products.length > 4 && (
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
      )}

      {/* ── Крапочки індикатора слайдів для мобільних (Mobile Dots) ── */}
      {products.length > 1 && (
        <div className={styles.dotsWrapper} aria-label="Carousel pagination">
          {products.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              onClick={() => swiperRef.current?.slideTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
