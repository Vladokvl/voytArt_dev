"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./ModalMedia.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";

type MediaItem = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
  order?: number;
};

type Props = {
  items: MediaItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function PostSlideMedia({
  item,
  isPriority,
  placeholderUrl,
}: {
  item: MediaItem;
  isPriority: boolean;
  placeholderUrl?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const fullUrl = getOptimizedImageUrl(item.url, { preset: "large" });

  if (item.type === "VIDEO") {
    return (
      <div className={styles.slideMedia}>
        <video
          key={item.url}
          className={styles.video}
          controls
          playsInline
          preload="metadata"
        >
          <source src={item.url} />
        </video>
      </div>
    );
  }

  return (
    <div className={styles.slideMedia}>
      {/* Blurred placeholder from grid cache — unmounted once full image loads */}
      {!isLoaded && placeholderUrl && (
        <Image
          src={placeholderUrl}
          alt=""
          fill
          aria-hidden
          className={styles.mediaPlaceholder}
          sizes="(max-width: 768px) 100vw, 85vw"
          priority
          draggable={false}
        />
      )}

      {/* Loading Spinner */}
      {!isLoaded && <span className={styles.loadingSpinner} aria-hidden />}

      {/* Full-res image */}
      <Image
        key={item.url}
        src={fullUrl}
        alt=""
        fill
        className={`${styles.image} ${isLoaded ? styles.imageLoaded : ""}`}
        sizes="(max-width: 768px) 100vw, 85vw"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default function ModalMedia({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const hasMultiple = items.length > 1;
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const nextIdx = currentIndex - 1;
      setCurrentIndex(nextIdx);
      onNavigate(nextIdx);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      onNavigate(nextIdx);
    }
  }, [currentIndex, items.length, onNavigate]);

  const handleGoTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onNavigate(index);
    },
    [onNavigate]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [onClose, handlePrev, handleNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!currentItem) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      {/* Top bar with counter & close button */}
      <div className={styles.topBar} onClick={(e) => e.stopPropagation()}>
        {hasMultiple && (
          <span className={styles.counterBadge}>
            {currentIndex + 1} / {items.length}
          </span>
        )}
        <button className={styles.close} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
      </div>

      {/* Main Content Box — stationary layout, no jumping */}
      <div className={styles.carouselContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.activeSlideWrap}>
          <PostSlideMedia
            key={currentItem.id}
            item={currentItem}
            isPriority={true}
            placeholderUrl={getOptimizedImageUrl(currentItem.url, { preset: "card" })}
          />
        </div>

        {/* Navigation arrows — fixed, stationary on hover */}
        {hasMultiple && (
          <>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prev}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous media"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.next}`}
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              aria-label="Next media"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Progress dashes placed outside/below the media area */}
      {hasMultiple && (
        <div
          className={styles.progressDashes}
          role="tablist"
          aria-label="Media progress"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => (
            <button
              key={`dash-${item.id}-${idx}`}
              type="button"
              role="tab"
              className={`${styles.dashItem} ${idx === currentIndex ? styles.dashItemActive : ""}`}
              onClick={() => handleGoTo(idx)}
              aria-label={`Go to item ${idx + 1}`}
              aria-selected={idx === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
