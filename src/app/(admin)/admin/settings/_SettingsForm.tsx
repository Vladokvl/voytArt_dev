"use client";

import { useState, useTransition } from "react";
import { History, Save, Copy, Check, ChevronDown, ChevronUp, Radio } from "lucide-react";
import styles from "./settings.module.scss";
import VersionsModal, { type VersionItem } from "./_VersionsModal";
import {
  toggleComingSoonAction,
  saveTranslationVersionAction,
  activateTranslationVersionAction,
} from "./_actions";

type MessagesRecord = Record<string, unknown>;

interface SettingsFormProps {
  initialComingSoonMode: boolean;
  initialTranslations: { en: MessagesRecord; uk: MessagesRecord };
  initialVersions: VersionItem[];
  siteUrl: string;
}

const sectionTitles: Record<string, string> = {
  nav: "Навігація та Меню",
  hero: "Головний екран (Hero)",
  section: "Секції головної сторінки (Про галерею, Арт, Шоп, Неон)",
  art: "Сторінка Арт та Картини",
  gallery: "Галерея та Історії",
  shop: "Магазин та Товари",
  cart: "Кошик та Замовлення",
  inquiry: "Запити щодо картин",
  footer: "Футер та Контакти",
  common: "Загальні тексти",
};

// Flatten helper to extract dot-path keys
function getLeaves(obj: MessagesRecord, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys = keys.concat(getLeaves(v as MessagesRecord, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

function getValueByPath(obj: MessagesRecord, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current && typeof current === "object" && p in (current as MessagesRecord)) {
      current = (current as MessagesRecord)[p];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

function setValueByPath(obj: MessagesRecord, path: string, value: string): MessagesRecord {
  const copy = JSON.parse(JSON.stringify(obj)) as MessagesRecord;
  const parts = path.split(".");
  let current = copy;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]!;
    if (!current[p] || typeof current[p] !== "object") {
      current[p] = {};
    }
    current = current[p] as MessagesRecord;
  }
  const lastKey = parts[parts.length - 1]!;
  current[lastKey] = value;
  return copy;
}

export default function SettingsForm({
  initialComingSoonMode,
  initialTranslations,
  initialVersions,
  siteUrl,
}: SettingsFormProps) {
  const [comingSoon, setComingSoon] = useState(initialComingSoonMode);
  const [isTogglingMode, startTransition] = useTransition();

  const [dataEn, setDataEn] = useState<MessagesRecord>(initialTranslations.en);
  const [dataUk, setDataUk] = useState<MessagesRecord>(initialTranslations.uk);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>(initialVersions);
  const [versionName, setVersionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  function toggleSection(sec: string) {
    setCollapsedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  }

  // Handle coming soon toggle
  async function handleToggleComingSoon(checked: boolean) {
    setComingSoon(checked);
    startTransition(async () => {
      const res = await toggleComingSoonAction(checked);
      if (!res.success) {
        setComingSoon(!checked); // rollback
        alert(res.error ?? "Не вдалося оновити режим");
      }
    });
  }

  // Copy preview link
  function handleCopyPreviewLink() {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : siteUrl;
    const base = origin.replace(/\/+$/, "");
    const previewUrl = `${base}/?preview=voytart`;
    void navigator.clipboard.writeText(previewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  // Handle input change
  function handleTextChange(lang: "en" | "uk", path: string, val: string) {
    if (lang === "en") {
      setDataEn((prev) => setValueByPath(prev, path, val));
    } else {
      setDataUk((prev) => setValueByPath(prev, path, val));
    }
  }

  // Save new translation version
  async function handleSaveVersion(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const formData = new FormData();
    formData.set("versionName", versionName);
    formData.set("jsonEn", JSON.stringify(dataEn));
    formData.set("jsonUk", JSON.stringify(dataUk));

    try {
      const res = await saveTranslationVersionAction(undefined, formData);
      if (res?.error) {
        setSaveMessage(`Помилка: ${res.error}`);
      } else {
        setSaveMessage("Нову версію успішно збережено та активовано!");
        setVersionName("");
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Activate past version
  async function handleActivateVersion(id: number) {
    const res = await activateTranslationVersionAction(id);
    if (res.success) {
      setVersions((prev) =>
        prev.map((v) => ({ ...v, isActive: v.id === id }))
      );
      const chosen = versions.find((v) => v.id === id);
      if (chosen) {
        if (chosen.dataEn && typeof chosen.dataEn === "object") {
          setDataEn(chosen.dataEn as MessagesRecord);
        }
        if (chosen.dataUk && typeof chosen.dataUk === "object") {
          setDataUk(chosen.dataUk as MessagesRecord);
        }
      }
      setIsModalOpen(false);
      setSaveMessage("Версію відновлено!");
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      alert(res.error ?? "Не вдалося активувати версію");
    }
  }

  // Group all translation keys by top-level section
  const allKeys = Array.from(new Set([...getLeaves(dataUk), ...getLeaves(dataEn)]));
  const keysBySection: Record<string, string[]> = {};

  allKeys.forEach((key) => {
    const topKey = key.split(".")[0]!;
    keysBySection[topKey] ??= [];
    keysBySection[topKey].push(key);
  });

  return (
    <div className={styles.container}>
      {/* ── 1. Top Action Bar ────────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.historyBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <History size={16} />
            <span>Історія версій перекладів</span>
            <span className={styles.badgeCount}>{versions.length}</span>
          </button>
        </div>

        <form onSubmit={handleSaveVersion} className={styles.saveGroup}>
          <input
            type="text"
            className={styles.versionNameInput}
            placeholder="Коментар до версії (необовʼязково)"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? "Збереження..." : "Зберегти нову версію"}</span>
          </button>
        </form>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            background: saveMessage.startsWith("Помилка") ? "#fef2f2" : "#f0fdf4",
            border: saveMessage.startsWith("Помилка") ? "1px solid #fecaca" : "1px solid #bbf7d0",
            color: saveMessage.startsWith("Помилка") ? "#991b1b" : "#166534",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* ── 2. Coming Soon Management Card ───────────────────────────── */}
      <div className={styles.comingSoonCard}>
        <div className={styles.comingSoonInfo}>
          <span className={styles.comingSoonTitle}>
            <Radio size={18} color={comingSoon ? "#10b981" : "#94a3b8"} />
            Режим сайту «Скоро відкриття» (Coming Soon)
          </span>
          <span className={styles.comingSoonDesc}>
            Коли увімкнено: на головній показується плашка, кнопки переходу в арт/шоп/галерею блокуються, а прямі переходи закриті для звичайних гостей.
          </span>
        </div>

        <div className={styles.comingSoonControls}>
          <button
            type="button"
            className={styles.copyLinkBtn}
            onClick={handleCopyPreviewLink}
            title="Скопіювати посилання для перегляду без обмежень"
          >
            {copiedLink ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copiedLink ? "Посилання скопійовано!" : "Скопіювати Preview-посилання"}</span>
          </button>

          <label className={styles.switch} title="Увімкнути або вимкнути режим очікування">
            <input
              type="checkbox"
              checked={comingSoon}
              disabled={isTogglingMode}
              onChange={(e) => handleToggleComingSoon(e.target.checked)}
            />
            <span className={styles.slider} />
          </label>
        </div>
      </div>

      {/* ── 3. Split-view Translation Editor ─────────────────────────── */}
      {Object.entries(keysBySection).map(([sectionKey, keys]) => {
        const isCollapsed = Boolean(collapsedSections[sectionKey]);
        const title = sectionTitles[sectionKey] ?? sectionKey.toUpperCase();

        return (
          <div key={sectionKey} className={styles.editorSection}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection(sectionKey)}
            >
              <span className={styles.sectionTitle}>
                {title}
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                  ({keys.length} полів)
                </span>
              </span>
              {isCollapsed ? <ChevronDown size={18} color="#64748b" /> : <ChevronUp size={18} color="#64748b" />}
            </div>

            {!isCollapsed && (
              <>
                <div className={styles.splitHeader}>
                  <div className={styles.splitHeaderCol}>English (EN)</div>
                  <div className={styles.splitHeaderCol}>Українська (UK)</div>
                </div>

                <div className={styles.rowsList}>
                  {keys.map((keyPath) => {
                    const valEn = getValueByPath(dataEn, keyPath);
                    const valUk = getValueByPath(dataUk, keyPath);
                    const isLongText = valEn.length > 50 || valUk.length > 50 || valEn.includes("\n") || valUk.includes("\n");

                    return (
                      <div key={keyPath} className={styles.rowItem}>
                        <span className={styles.keyLabel}>{keyPath}</span>
                        <div className={styles.inputsGrid}>
                          {isLongText ? (
                            <textarea
                              rows={3}
                              className={styles.fieldInput}
                              value={valEn}
                              onChange={(e) => handleTextChange("en", keyPath, e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              className={styles.fieldInput}
                              value={valEn}
                              onChange={(e) => handleTextChange("en", keyPath, e.target.value)}
                            />
                          )}

                          {isLongText ? (
                            <textarea
                              rows={3}
                              className={styles.fieldInput}
                              value={valUk}
                              onChange={(e) => handleTextChange("uk", keyPath, e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              className={styles.fieldInput}
                              value={valUk}
                              onChange={(e) => handleTextChange("uk", keyPath, e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* ── 4. History & Rollback Modal ──────────────────────────────── */}
      <VersionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        versions={versions}
        onActivate={handleActivateVersion}
      />
    </div>
  );
}
