"use client";

import React from "react";
import { useLanguage } from "~/context/LanguageContext";
import styles from "./LanguageSwitcher.module.scss";

interface LanguageSwitcherProps {
  inMenu?: boolean;
}

export default function LanguageSwitcher({ inMenu = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`${styles.switcher} ${inMenu ? styles.switcherInMenu : ""}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        className={`${styles.btn} ${locale === "en" ? styles.active : ""}`}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={`${styles.btn} ${locale === "uk" ? styles.active : ""}`}
        onClick={() => setLocale("uk")}
        aria-pressed={locale === "uk"}
      >
        UA
      </button>
    </div>
  );
}
