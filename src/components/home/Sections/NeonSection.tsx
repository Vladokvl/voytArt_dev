"use client";
import Link from "next/link";
import styles from "./Sections.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function NeonSection() {
  const { t, getLocalizedHref } = useTranslation();

  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>{t("section.neon.num")}</span>
        <span className={`${styles.stat} ${styles.statBonus}`}>{t("section.neon.tag")}</span>
      </div>
      <p className={styles.tagline}>{t("section.neon.label")}</p>
      <h2 className={styles.heading}>
        {t("section.neon.title")}
      </h2>
      <p className={styles.description}>
        {t("section.neon.desc")}
      </p>
      <Link href={getLocalizedHref("/art?neon=true")} className={styles.cta}>
        {t("section.neon.btn")}
      </Link>
    </>
  );
}
