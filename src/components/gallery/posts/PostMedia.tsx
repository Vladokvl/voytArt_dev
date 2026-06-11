"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./PostMedia.module.scss";
import ModalMedia from "./ModalMedia";

type MediaItem = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
  order: number;
};

/** Cloudinary video → auto-generated poster image (JPG) */
function videoPoster(url: string): string {
  return url
    .replace("/video/upload/", "/video/upload/so_auto,w_800/")
    .replace(/\.[^.]+$/, ".jpg");
}

export default function PostMedia({ items }: { items: MediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Media</h2>

          <div className={styles.grid}>
            {sorted.map((item, idx) => (
              <button
                key={item.id}
                className={styles.item}
                onClick={() => setActiveIndex(idx)}
                aria-label={item.type === "VIDEO" ? "Відкрити відео" : "Відкрити фото"}
              >
                <Image
                  src={item.type === "VIDEO" ? videoPoster(item.url) : item.url}
                  alt=""
                  fill
                  className={styles.thumb}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <span className={styles.overlay} aria-hidden />
                {item.type === "VIDEO" && (
                  <span className={styles.playBtn} aria-hidden>
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" fill="rgba(0,0,0,0.45)" />
                      <polygon points="19,15 37,24 19,33" fill="white" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <ModalMedia
          items={sorted}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
