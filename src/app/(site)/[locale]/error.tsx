"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "~/context/LanguageContext";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, getLocalizedHref } = useTranslation();

  useEffect(() => {
    console.error("Storefront Error:", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "75vh",
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
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: "1.75rem",
            fontWeight: 700,
          }}
        >
          !
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          {t("common.errorTitle") ?? "Щось пішло не так"}
        </h1>

        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
          {error.message || "Виникла неочікувана помилка при завантаженні даних."}
        </p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              background: "var(--color-accent, #d7ff01)",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            {t("common.retry") ?? "Спробувати знову"}
          </button>

          <Link
            href={getLocalizedHref("/")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            {t("nav.home") ?? "На головну"}
          </Link>
        </div>
      </div>
    </main>
  );
}
