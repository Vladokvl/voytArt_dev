"use client";

import React from "react";
import { useLanguage } from "~/context/LanguageContext";
import styles from "./LanguageSwitcher.module.scss";

interface LanguageSwitcherProps {
  inMenu?: boolean;
  horizontal?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  inMenu = false,
  horizontal = false,
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  const menuClass = horizontal
    ? styles.switcherInMenuHorizontal
    : inMenu
    ? styles.switcherInMenu
    : "";

  return (
    <div
      className={`${styles.switcher} ${menuClass} ${className}`.trim()}
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
