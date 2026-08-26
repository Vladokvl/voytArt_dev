"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./productModal.module.scss";
import { useState, useEffect } from "react";
import { useTranslation } from "~/context/LanguageContext";
import { useLenis } from "~/context/LenisContext";
import { getLocalized } from "~/lib/i18n";

type ProductImage = { id: number; url: string; order: number };
type Author = { id: number; firstName: string; firstNameUk?: string | null; lastName: string; lastNameUk?: string | null };
type Category = { id: number; name: string; nameUk?: string | null; slug: string };

type Product = {
  id: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
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
  const { t, locale } = useTranslation();
  const { start: startLenis, stop: stopLenis } = useLenis();
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
      stopLenis();
    } else {
      document.body.style.overflow = "";
      startLenis();
    }

    return () => {
      document.body.style.overflow = "";
      startLenis();
    };
  }, [product, startLenis, stopLenis]);

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
            <div className={styles.scrollableContent} data-lenis-prevent>
              <p className={styles.authorLabel}>
                {product.author ? `${getLocalized(product.author, "firstName", locale)} ${getLocalized(product.author, "lastName", locale)}` : "VoytArt Gallery"}
              </p>
              <Dialog.Title className={styles.title}>{getLocalized(product, "title", locale)}</Dialog.Title>
              <span className={styles.modalPrice}>
                {product.price.toLocaleString("en-US")} €
              </span>

              {product.description && (
                <div
                  className={styles.description}
                  data-lenis-prevent
                  dangerouslySetInnerHTML={{ __html: getLocalized(product, "description", locale) || "" }}
                />
              )}

              <div className={styles.stockStatus}>
                {product.stock > 0 ? (
                  <span className={styles.inStock}>{t("shop.inStock", { count: product.stock })}</span>
                ) : (
                  <span className={styles.outOfStock}>{t("shop.outOfStock")}</span>
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
                {t("shop.addToCart")}
              </button>
              <Dialog.Close className={styles.btnGhost}>{t("art.close")}</Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
