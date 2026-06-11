"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./paintingCard.module.scss";
import { useState } from "react";

type MediaItem = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

type PaintingCardProps = {
  id: number;
  title: string;
  description: string | null;
  coverUrl: string;
  year: number | null;
  author: { firstName: string; lastName: string };
  media: MediaItem[];
};

export default function PaintingCard({ painting }: { painting: PaintingCardProps }) {
  const defaultMedia = painting.media.filter((m) => !m.isNeon);
  const neonMedia = painting.media.filter((m) => m.isNeon);
  const hasNeonMedia = neonMedia.length > 0;

  // Cover is always first in default mode; deduplicate if it's already in media
  const coverItem: MediaItem = {
    id: -painting.id,
    url: painting.coverUrl,
    isNeon: false,
    order: -1,
    type: "IMAGE",
  };
  const defaultItems: MediaItem[] = [
    coverItem,
    ...defaultMedia.filter((m) => m.url !== painting.coverUrl),
  ];

  const [open, setOpen] = useState(false);
  const [isNeon, setIsNeon] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());

  const activeItems = isNeon ? neonMedia : defaultItems;
  const hasMultiple = activeItems.length > 1;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setIsNeon(false);
      setActiveIndex(0);
      setIsZoomed(false);
      setLoadedSet(new Set());
    }
  };

  const handleModeToggle = () => {
    setIsNeon((v) => !v);
    setActiveIndex(0);
    setIsZoomed(false);
    setLoadedSet(new Set());
  };

  const navigate = (dir: "prev" | "next") => {
    const len = activeItems.length;
    setActiveIndex((i) =>
      dir === "prev" ? (i === 0 ? len - 1 : i - 1) : (i === len - 1 ? 0 : i + 1)
    );
    setIsZoomed(false);
  };

  const markLoaded = (url: string) => {
    setLoadedSet((s) => new Set([...s, url]));
  };

  // Show spinner until all image-type items in the active set are loaded
  const allLoaded = activeItems
    .filter((m) => m.type === "IMAGE")
    .every((m) => loadedSet.has(m.url));

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <div className={styles.card}>
          <Image
            src={painting.coverUrl}
            alt={painting.title}
            width={1200}
            height={1200}
            className={styles.cardImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.modal}
          data-neon={isNeon ? "true" : undefined}
        >
          {/* ── Slider area ─────────────────────────────────── */}
          <div className={styles.imageWrap}>
            {/* Spinner shown while images load */}
            {!allLoaded && <div className={styles.spinner} aria-hidden="true" />}

            {/* All slides pre-rendered; translateX reveals active slide */}
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {activeItems.map((item, idx) => (
                <div className={styles.slide} key={`${item.id}-${item.url}`}>
                  {item.type === "VIDEO" ? (
                    <video
                      className={styles.mediaEl}
                      controls
                      autoPlay={idx === activeIndex}
                      playsInline
                      data-zoomed={isZoomed ? "true" : undefined}
                    >
                      <source src={item.url} />
                    </video>
                  ) : (
                    <Image
                      src={item.url}
                      alt={painting.title}
                      fill
                      className={styles.mediaEl}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      data-zoomed={isZoomed ? "true" : undefined}
                      onLoad={() => markLoaded(item.url)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Zoom button */}
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => setIsZoomed((z) => !z)}
              aria-label={isZoomed ? "Показати повністю" : "Наблизити"}
            >
              {isZoomed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="10" y1="14" x2="3" y2="21" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>

            {/* Navigation */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navPrev}`}
                  onClick={() => navigate("prev")}
                  aria-label="Попереднє"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navNext}`}
                  onClick={() => navigate("next")}
                  aria-label="Наступне"
                >
                  ›
                </button>
                <div className={styles.counter}>
                  {activeIndex + 1} / {activeItems.length}
                </div>
              </>
            )}
          </div>

          {/* ── Info panel ──────────────────────────────────── */}
          <div className={styles.info}>
            <div>
              <p className={styles.authorLabel}>
                {painting.author.firstName} {painting.author.lastName}
              </p>
              <Dialog.Title className={styles.title}>{painting.title}</Dialog.Title>

              {hasNeonMedia && (
                <label className={styles.switchWrap} aria-label="Переключити режим">
                  <span className={styles.switchTrack}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={isNeon}
                      onChange={handleModeToggle}
                    />
                    <span className={styles.switchThumb} />
                  </span>
                </label>
              )}

              {painting.description && (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: painting.description }}
                />
              )}
            </div>

            <div className={styles.actions}>
              <a href="mailto:contact@voytart.com" className={styles.btnPrimary}>
                Зв&apos;язатись щодо картини
              </a>
              <Dialog.Close className={styles.btnGhost}>Закрити</Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
