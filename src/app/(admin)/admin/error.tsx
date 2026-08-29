"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "450px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          !
        </div>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Помилка панелі керування</h2>

        <p style={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
          {error.message || "Сталася помилка при завантаженні розділу адмінки."}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              background: "#3b82f6",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Спробувати знову
          </button>

          <Link
            href="/admin"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              background: "#27272a",
              color: "#f4f4f5",
              fontWeight: 500,
              fontSize: "0.85rem",
              textDecoration: "none",
              border: "1px solid #3f3f46",
            }}
          >
            На головну адмінки
          </Link>
        </div>
      </div>
    </div>
  );
}
