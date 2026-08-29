"use client";

import Link from "next/link";
import { useTranslation } from "~/context/LanguageContext";

export default function NotFound() {
  const { t, getLocalizedHref } = useTranslation();

  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        color: "var(--foreground, #f8fafc)",
        background: "var(--background, #080808)",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <span
          style={{
            fontSize: "5rem",
            fontWeight: 900,
            lineHeight: 1,
            color: "var(--color-accent, #d7ff01)",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </span>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          {t("common.notFoundTitle") ?? "Сторінку не знайдено"}
        </h1>

        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
          {t("common.notFoundDesc") ?? "Можливо, ця сторінка була переміщена або видалена."}
        </p>

        <Link
          href={getLocalizedHref("/")}
          style={{
            marginTop: "1rem",
            padding: "0.85rem 2rem",
            borderRadius: "999px",
            background: "var(--color-accent, #d7ff01)",
            color: "#000000",
            fontWeight: 700,
            fontSize: "0.95rem",
            textDecoration: "none",
            transition: "transform 0.15s ease",
          }}
        >
          {t("nav.home") ?? "На головну"}
        </Link>
      </div>
    </main>
  );
}
