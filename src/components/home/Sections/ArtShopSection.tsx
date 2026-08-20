"use client";
import Link from "next/link";
import styles from "./Sections.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function ArtShopSection() {
  const { t, getLocalizedHref } = useTranslation();

  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>{t("section.shop.num")}</span>
        <span className={styles.stat}>{t("section.shop.tag")}</span>
      </div>
      <p className={styles.tagline}>{t("section.shop.label")}</p>
      <h2 className={styles.heading}>
        {t("section.shop.title")}
      </h2>
      <p className={styles.description}>
        {t("section.shop.desc")}
      </p>
      <Link
        href={getLocalizedHref("/shop")}
        className={`${styles.cta} ${styles.ctaAccent}`}
      >
        {t("section.shop.btn")}
      </Link>
    </>
  );
}
