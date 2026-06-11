"use client";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ModalMedia.module.scss";

type MediaItem = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
};

type Props = {
  items: MediaItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function ModalMedia({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: Props) {
  const current = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(activeIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(activeIndex + 1);
    },
    [onClose, onNavigate, activeIndex, hasPrev, hasNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!current) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
    >
      {/* Close */}
      <button className={styles.close} onClick={onClose} aria-label="Close">
        ✕
      </button>

      {/* Prev */}
      <button
        className={styles.prev}
        onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }}
        disabled={!hasPrev}
        aria-label="Prev"
      >
        ‹
      </button>

      {/* Content */}
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        {current.type === "VIDEO" ? (
          <video
            key={current.url}
            className={styles.video}
            controls
            autoPlay
            playsInline
          >
            <source src={current.url} />
          </video>
        ) : (
          <Image
            key={current.url}
            src={current.url}
            alt=""
            width={1400}
            height={900}
            className={styles.image}
          />
        )}
      </div>

      {/* Next */}
      <button
        className={styles.next}
        onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }}
        disabled={!hasNext}
        aria-label="Next"
      >
        ›
      </button>

      {/* Counter */}
      {items.length > 1 && (
        <span className={styles.counter}>
          {activeIndex + 1} / {items.length}
        </span>
      )}
    </div>
  );
}
