"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./productModal.module.scss";
import { useState, useEffect } from "react";

type ProductImage = { id: number; url: string; order: number };
type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string; slug: string };

type Product = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  sortOrder: number;
  categoryId: number;
  authorId: number;
  author: Author;
  category: Category;
  coverUrl: string;
  isFeatured: boolean;
  images: ProductImage[];
};

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveIndex(0);
      setLoadedSet(new Set());
    }
  }, [product]);

  // Block Lenis scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).lenis) (window as any).lenis.stop();
    } else {
      document.body.style.overflow = "";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).lenis) (window as any).lenis.start();
    }

    return () => {
      document.body.style.overflow = "";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).lenis) (window as any).lenis.start();
    };
  }, [product]);

  if (!product) return null;

  // Build full gallery array starting with cover photo
  const galleryItems = [
    { url: product.coverUrl || "/voyt.svg" },
    ...product.images.map((img) => ({ url: img.url })),
  ];
  // Filter out duplicates if coverUrl is in images
  const uniqueItems = Array.from(new Set(galleryItems.map(i => i.url))).map(url => ({ url }));

  const hasMultiple = uniqueItems.length > 1;

  const navigate = (dir: "prev" | "next") => {
    const len = uniqueItems.length;
    setActiveIndex((i) =>
      dir === "prev" ? (i === 0 ? len - 1 : i - 1) : (i === len - 1 ? 0 : i + 1)
    );
  };

  const markLoaded = (url: string) => {
    setLoadedSet((s) => new Set([...s, url]));
  };

  const currentItem = uniqueItems[activeIndex];
  const isCurrentLoaded = currentItem ? loadedSet.has(currentItem.url) : true;

  return (
    <Dialog.Root open={!!product} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modal}>
          {/* ── Slider area ─────────────────────────────────── */}
          <div className={styles.imageWrap}>
            {!isCurrentLoaded && <div className={styles.spinner} aria-hidden="true" />}

            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {uniqueItems.map((item, _idx) => (
                <div
                  className={styles.slide}
                  key={item.url}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("--mouse-x", `50%`);
                    e.currentTarget.style.setProperty("--mouse-y", `50%`);
                  }}
                >
                  <Image
                    src={item.url}
                    alt={product.title}
                    fill
                    className={styles.mediaEl}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    onLoad={() => markLoaded(item.url)}
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navPrev}`}
                  onClick={() => navigate("prev")}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navNext}`}
                  onClick={() => navigate("next")}
                  aria-label="Next"
                >
                  ›
                </button>
                <div className={styles.counter}>
                  {activeIndex + 1} / {uniqueItems.length}
                </div>
              </>
            )}
          </div>

          {/* ── Info panel ──────────────────────────────────── */}
          <div className={styles.info}>
            <div>
              <p className={styles.authorLabel}>
                {product.author.firstName} {product.author.lastName}
              </p>
              <Dialog.Title className={styles.title}>{product.title}</Dialog.Title>
              <span className={styles.modalPrice}>
                ${product.price.toLocaleString()}
              </span>

              {product.description && (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              <div className={styles.stockStatus}>
                {product.stock > 0 ? (
                  <span className={styles.inStock}>In Stock ({product.stock})</span>
                ) : (
                  <span className={styles.outOfStock}>Out of stock</span>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className={styles.btnPrimary}
              >
                Add to Cart
              </button>
              <Dialog.Close className={styles.btnGhost}>Close</Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
