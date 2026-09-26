"use client";

import { useState } from "react";
import { X, CheckCircle, Eye, RefreshCw } from "lucide-react";
import styles from "./settings.module.scss";

export type VersionItem = {
  id: number;
  name: string | null;
  isActive: boolean;
  createdAt: string;
  dataEn: unknown;
  dataUk: unknown;
};

interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: VersionItem[];
  onActivate: (id: number) => Promise<void>;
}

export default function VersionsModal({
  isOpen,
  onClose,
  versions,
  onActivate,
}: VersionsModalProps) {
  const [selectedPreviewId, setSelectedPreviewId] = useState<number | null>(null);
  const [isActivatingId, setIsActivatingId] = useState<number | null>(null);

  if (!isOpen) return null;

  async function handleActivate(id: number) {
    if (!confirm("Ви впевнені, що хочете активувати цю версію перекладів на сайті?")) {
      return;
    }
    setIsActivatingId(id);
    try {
      await onActivate(id);
    } finally {
      setIsActivatingId(null);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Історія версій перекладів</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {versions.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", margin: "2rem 0" }}>
              Збережених версій перекладів ще немає.
            </p>
          ) : (
            versions.map((ver) => {
              const dateFormatted = new Date(ver.createdAt).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const isSelected = selectedPreviewId === ver.id;
              const isActivating = isActivatingId === ver.id;

              return (
                <div
                  key={ver.id}
                  className={`${styles.versionCard} ${ver.isActive ? styles.versionActive : ""}`}
                >
                  <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div className={styles.versionInfo}>
                        <div className={styles.versionName}>
                          <span>{ver.name ?? `Версія #${ver.id}`}</span>
                          {ver.isActive && <span className={styles.activeBadge}>Активна зараз</span>}
                        </div>
                        <span className={styles.versionDate}>{dateFormatted}</span>
                      </div>

                      <div className={styles.versionActions}>
                        <button
                          type="button"
                          className={styles.previewVersionBtn}
                          onClick={() => setSelectedPreviewId(isSelected ? null : ver.id)}
                        >
                          <Eye size={12} style={{ marginRight: 4 }} />
                          <span>{isSelected ? "Згорнути" : "Переглянути"}</span>
                        </button>

                        {!ver.isActive && (
                          <button
                            type="button"
                            className={styles.activateVersionBtn}
                            disabled={isActivating}
                            onClick={() => handleActivate(ver.id)}
                          >
                            {isActivating ? (
                              <RefreshCw size={12} className="spin" style={{ marginRight: 4 }} />
                            ) : (
                              <CheckCircle size={12} style={{ marginRight: 4 }} />
                            )}
                            <span>{isActivating ? "Застосування..." : "Застосувати"}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className={styles.previewViewer}>
                        <strong>Українська (UK):</strong>
                        {"\n"}
                        {JSON.stringify(ver.dataUk, null, 2)}
                        {"\n\n"}
                        <strong>English (EN):</strong>
                        {"\n"}
                        {JSON.stringify(ver.dataEn, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
