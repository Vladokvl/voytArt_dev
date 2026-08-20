"use client";
import Link from "next/link";
import styles from "./Sections.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function ArtSection() {
  const { t, getLocalizedHref } = useTranslation();

  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>{t("section.art.num")}</span>
        <span className={styles.stat}>{t("section.art.tag")}</span>
      </div>
      <p className={styles.tagline}>{t("section.art.label")}</p>
      <h2 className={styles.heading}>
        {t("section.art.title")}
      </h2>
      <p className={styles.description}>
        {t("section.art.desc")}
      </p>
      <Link href={getLocalizedHref("/art")} className={styles.cta}>
        {t("section.art.btn")}
      </Link>
    </>
  );
}
