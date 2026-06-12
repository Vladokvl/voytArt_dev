"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./paintingCard.module.scss";
import { useState, useEffect } from "react";


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
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());

  const activeItems = isNeon ? neonMedia : defaultItems;
  const hasMultiple = activeItems.length > 1;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setIsNeon(false);
      setActiveIndex(0);
      setLoadedSet(new Set());
    }
  };

  const handleModeToggle = () => {
    setIsNeon((v) => !v);
    setActiveIndex(0);
    setLoadedSet(new Set());
  };

  const navigate = (dir: "prev" | "next") => {
    const len = activeItems.length;
    setActiveIndex((i) =>
      dir === "prev" ? (i === 0 ? len - 1 : i - 1) : (i === len - 1 ? 0 : i + 1)
    );
  };

  const markLoaded = (url: string) => {
    setLoadedSet((s) => new Set([...s, url]));
  };

  // Show spinner until the currently active image is loaded
  const currentItem = activeItems[activeIndex];
  const isCurrentLoaded =
    currentItem?.type === "VIDEO"
      ? true
      : currentItem
      ? loadedSet.has(currentItem.url)
      : true;

  // Block Lenis scroll when modal is open
  useEffect(() => {
    if (open) {
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
  }, [open]);

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
            {/* Spinner shown while active image loads */}
            {!isCurrentLoaded && <div className={styles.spinner} aria-hidden="true" />}

            {/* All slides pre-rendered; translateX reveals active slide */}
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {activeItems.map((item, idx) => (
                <div
                  className={styles.slide}
                  key={`${item.id}-${item.url}`}
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
                  {item.type === "VIDEO" ? (
                    <video
                      className={styles.mediaEl}
                      controls
                      autoPlay={idx === activeIndex}
                      playsInline
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
                      onLoad={() => markLoaded(item.url)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Zoom button removed as per zoom hover logic */}

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
                <label className={styles.switchWrap} aria-label="Toggle neon mode">
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
                Inquire about this painting
              </a>
              <Dialog.Close className={styles.btnGhost}>Close</Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
