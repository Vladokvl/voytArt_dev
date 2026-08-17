"use client";
import React, { useRef } from "react";
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

  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.8;
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.buttons}>
          <button type="button" className={styles.button} aria-label="Previous" onClick={() => scroll("left")}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9L2 5L6 1"/>
            </svg>
          </button>
          <button type="button" className={styles.button} aria-label="Next" onClick={() => scroll("right")}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9L8 5L4 1"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {products.map((product, index) => {
          const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
          const coverImg = rawUrl ? getOptimizedImageUrl(rawUrl, { preset: "card" }) : "/voyt.svg";
          return (
            <div key={product.id} className={styles.slide}>
              <div className={styles.productCard}>
                <Link href={`/shop/${product.id}`} className={styles.imageWrapper}>
                  <Image
                    src={coverImg}
                    alt={product.title}
                    fill
                    priority={index < 2}
                    className={styles.productImage}
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                  {product.stock <= 0 && <div className={styles.soldOut}>Sold Out</div>}
                </Link>

                <div className={styles.cardInfo}>
                  <p className={styles.authorName}>
                    {product.author ? `${product.author.firstName} ${product.author.lastName}` : ""}
                  </p>
                  <Link href={`/shop/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
