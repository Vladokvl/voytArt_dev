"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { locale, comingSoonMode: ctxComingSoon, isPreview: ctxIsPreview } = useTranslation();

  const [clientIsPreview, setClientIsPreview] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie
        .split("; ")
        .some((c) => c.startsWith("voytart_preview=true"));
      const hasQuery =
        typeof window !== "undefined" &&
        (window.location.search.includes("preview=true") ||
          window.location.search.includes("preview=voytart"));
      if (hasCookie || hasQuery) {
        setClientIsPreview(true);
      }
    }
  }, []);

  const isPreviewMode = propIsPreview ?? (ctxIsPreview || clientIsPreview);
  const isModeActive = (propComingSoon ?? ctxComingSoon) || isPreviewMode;

  useEffect(() => {
    if (isModeActive && !isAdmin) {
      document.documentElement.style.setProperty("--banner-offset", "52px");
    } else {
      document.documentElement.style.removeProperty("--banner-offset");
    }
    return () => {
      document.documentElement.style.removeProperty("--banner-offset");
    };
  }, [isModeActive, isAdmin]);

  if (!isModeActive || isAdmin) return null;

  const isUk = locale === "uk";

  return (
    <>
      <style>{`:root { --banner-offset: 52px; }`}</style>
      {isPreviewMode ? (
        <aside className={`${styles.banner} ${styles.previewBanner}`} aria-label="Preview Mode Banner">
          <div className={styles.content}>
            <span className={styles.pulseDot} />
            <span className={styles.badge}>
              {isUk ? "Preview" : "Preview"}
            </span>
            <span className={styles.title}>
              {isUk ? "Режим попереднього перегляду" : "Preview Mode Active"}
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.subtext}>
              {isUk
                ? "Сайт закрито для звичайних відвідувачів"
                : "Site is restricted to normal visitors"}
            </span>
          </div>
          <a
            href={`/${locale}?preview=false`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${locale}?preview=false`;
            }}
            className={styles.exitBtn}
            title={isUk ? "Вийти з режиму попереднього перегляду" : "Exit preview mode"}
          >
            <span>{isUk ? "Вийти з Preview ✕" : "Exit Preview ✕"}</span>
          </a>
        </aside>
      ) : (
        <aside className={`${styles.banner} ${styles.normalBanner}`} aria-label="Coming Soon Banner">
          <div className={styles.content}>
            <span className={styles.pulseDot} />
            <span className={styles.badge}>
              {isUk ? "Скоро відкриття" : "Coming Soon"}
            </span>
            <span className={styles.title}>
              {isUk ? "Допрацьовуємо останні штрихи" : "Finishing touches in progress"}
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.subtext}>
              {isUk
                ? "Онлайн-галерея незабаром відкриється."
                : "Online gallery opening very soon."}
            </span>
          </div>
        </aside>
      )}
    </>
  );
}
