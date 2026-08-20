"use client";
import { forwardRef } from "react";
import Image from "next/image";
import styles from "./Sections.module.scss";
import { useTranslation } from "~/context/LanguageContext";

const LogoSection = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <section ref={ref} className={styles.heroSection}>
      <div className={styles.heroContent} id="hero-content">
        <h1 className={styles.title}>VOYT ART GALLERY</h1>
        <p className={styles.subtitle}>
          {t("hero.subtitle")}
        </p>
        <div className={styles.logoWrapper}>
          <Image
            src="/voytCirclelogo.svg"
            alt="Voyt"
            fill
            className={styles.logo}
          />
        </div>
      </div>
    </section>
  );
});

LogoSection.displayName = "LogoSection";
export default LogoSection;
