"use client";
import Link from "next/link";
import styles from "./Sections.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function AboutGallerySection() {
  const { t, getLocalizedHref } = useTranslation();

  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>{t("section.about.num")}</span>
        <span className={styles.stat}>{t("section.about.tag")}</span>
      </div>
      <p className={styles.tagline}>{t("section.about.label")}</p>
      <h2 className={styles.heading}>
        {t("section.about.title")}
      </h2>
      <p className={styles.description}>
        {t("section.about.desc")}
      </p>
      <Link href={getLocalizedHref("/gallery")} className={styles.cta}>
        {t("section.about.btn")}
      </Link>
    </>
  );
}
