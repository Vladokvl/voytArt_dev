"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCarousel.module.scss";
import type { Product } from "~/app/shop/_ShopStorefront";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCarousel({ title, products, onAddToCart }: ProductCarouselProps) {
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
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          const coverImg = product.coverUrl || product.images?.[0]?.url || "/voyt.svg";
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
                  {product.stock <= 0 && <div className={styles.soldOut}>Немає в наявності</div>}
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
                    <span className={styles.price}>{product.price.toLocaleString("uk-UA")} €</span>
                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={styles.addToCartBtn}
                    >
                      Купити
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
