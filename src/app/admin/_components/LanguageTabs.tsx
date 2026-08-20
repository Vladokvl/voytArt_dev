"use client";

import React from "react";

interface LanguageTabsProps {
  activeTab: "en" | "uk";
  onChange: (tab: "en" | "uk") => void;
}

export default function LanguageTabs({ activeTab, onChange }: LanguageTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.25rem",
        padding: "0.25rem",
        background: "#f1f5f9",
        borderRadius: "8px",
        width: "fit-content",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("en")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.45rem 0.9rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          background: activeTab === "en" ? "#ffffff" : "transparent",
          color: activeTab === "en" ? "#0f172a" : "#64748b",
          boxShadow: activeTab === "en" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <span>🇬🇧</span>
        <span>English (Default)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("uk")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.45rem 0.9rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          background: activeTab === "uk" ? "#ffffff" : "transparent",
          color: activeTab === "uk" ? "#0f172a" : "#64748b",
          boxShadow: activeTab === "uk" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <span>🇺🇦</span>
        <span>Українська</span>
      </button>
    </div>
  );
}
