"use client";
import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCarousel.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";

export type CarouselItem = {
  id: number;
  title: string;
  price: number;
  stock: number;
  coverUrl?: string | null;
  images?: { id: number; url: string; order: number }[];
  author?: { firstName: string; lastName: string } | null;
  category?: { id: number; name: string; slug: string } | null;
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // ── Плавна анімація скролу через RAF (cubic easeOut) ──
  const smoothScrollTo = useCallback((targetLeft: number, duration = 450) => {
    const track = trackRef.current;
    if (!track) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const clampedTarget = Math.max(0, Math.min(maxScroll, targetLeft));
    const distance = clampedTarget - startLeft;

    if (Math.abs(distance) < 1) return;

    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      track.scrollLeft = startLeft + distance * eased;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // ── Плавний скрол кнопками вліво / вправо ──
  const scroll = useCallback((direction: "left" | "right") => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slide = track.querySelector<HTMLElement>(`.${styles.slide}`);
    const cardStep = slide ? slide.offsetWidth + 16 : 300;
    const scrollDistance = cardStep * 1.2;

    const targetLeft =
      direction === "left"
        ? track.scrollLeft - scrollDistance
        : track.scrollLeft + scrollDistance;

    smoothScrollTo(targetLeft, 500);
  }, [smoothScrollTo]);

  // ── Drag-to-scroll мишкою (Swiper style) ──
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    isDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    setIsGrabbing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;

    if (Math.abs(walk) > 6) {
      isDraggingRef.current = true;
    }

    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setIsGrabbing(false);
  };

  // Запобігаємо випадковому відкриттю картки/посилання під час драгу
  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
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

      <div
        className={`${styles.track} ${isGrabbing ? styles.isGrabbing : ""}`}
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
      >
        {products.map((product, index) => {
          const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
          const coverImg = rawUrl ? getOptimizedImageUrl(rawUrl, { preset: "card" }) : "/voyt.svg";
          return (
            <div key={product.id} className={styles.slide}>
              <div className={styles.productCard}>
                <Link href={`/shop/${product.id}`} className={styles.imageWrapper} draggable={false}>
                  <Image
                    src={coverImg}
                    alt={product.title}
                    fill
                    priority={index < 2}
                    className={styles.productImage}
                    sizes="(max-width: 640px) 100vw, 300px"
                    draggable={false}
                  />
                  {product.stock <= 0 && <div className={styles.soldOut}>Sold Out</div>}
                </Link>

                <div className={styles.cardInfo}>
                  <p className={styles.authorName}>
                    {product.author ? `${product.author.firstName} ${product.author.lastName}` : ""}
                  </p>
                  <Link href={`/shop/${product.id}`} style={{ textDecoration: "none", color: "inherit" }} draggable={false}>
                    <h3 className={styles.productTitle}>
                      {product.title}
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
                      {product.stock <= 0 ? "Sold Out" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
