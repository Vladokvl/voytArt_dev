"use client";

import Link from "next/link";
import { useTranslation } from "~/context/LanguageContext";
import styles from "./ComingSoonBanner.module.scss";

interface ComingSoonBannerProps {
  comingSoonMode?: boolean;
  isPreview?: boolean;
}

export default function ComingSoonBanner({
  comingSoonMode: propComingSoon,
  isPreview: propIsPreview,
}: ComingSoonBannerProps) {
  const { locale, comingSoonMode: ctxComingSoon, isPreview: ctxIsPreview } = useTranslation();

  const isModeActive = propComingSoon ?? ctxComingSoon;
  const isPreviewMode = propIsPreview ?? ctxIsPreview;

  if (!isModeActive) return null;

  const isUk = locale === "uk";

  if (isPreviewMode) {
    return (
      <aside className={`${styles.banner} ${styles.previewBanner}`} aria-label="Preview Mode Banner">
        <div className={styles.content}>
          <span className={styles.previewDot} />
          <span className={styles.title}>
            {isUk ? "Режим попереднього перегляду" : "Preview Mode"}
          </span>
          <span className={styles.separator}>•</span>
          <span>
            {isUk
              ? "Сайт наразі закрито для звичайних відвідувачів"
              : "Site is currently restricted to visitors"}
          </span>
        </div>
        <Link href="?preview=false" className={styles.exitBtn} title={isUk ? "Вийти з режиму попереднього перегляду" : "Exit preview mode"}>
          <span>{isUk ? "Вийти з Preview ✕" : "Exit Preview ✕"}</span>
        </Link>
      </aside>
    );
  }

  return (
    <aside className={`${styles.banner} ${styles.normalBanner}`} aria-label="Coming Soon Banner">
      <div className={styles.content}>
        <span className={styles.dot} />
        <span className={styles.title}>
          {isUk ? "Скоро відкриття" : "Coming Soon"}
        </span>
        <span className={styles.separator}>•</span>
        <span>
          {isUk
            ? "Допрацьовуємо останні штрихи. Онлайн-галерея незабаром відкриється."
            : "Putting the finishing touches. Online gallery opening very soon."}
        </span>
      </div>
    </aside>
  );
}
