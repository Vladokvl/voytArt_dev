"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check } from "lucide-react";
import styles from "./analytics.module.scss";

export default function DateRangePicker({
  currentPeriod,
  currentFrom,
  currentTo,
  currentDate,
}: {
  currentPeriod: string;
  currentFrom?: string;
  currentTo?: string;
  currentDate?: string;
}) {
  const router = useRouter();

  const [mode, setMode] = useState<"preset" | "single" | "range">(
    currentDate ? "single" : (currentFrom ?? currentTo) ? "range" : "preset"
  );
  const [singleDate, setSingleDate] = useState(currentDate ?? new Date().toISOString().slice(0, 10));
  const [fromDate, setFromDate] = useState(currentFrom ?? "");
  const [toDate, setToDate] = useState(currentTo ?? "");

  const handleApplySingleDate = () => {
    if (!singleDate) return;
    router.push(`/admin/analytics?date=${singleDate}`);
  };

  const handleApplyRange = () => {
    if (!fromDate && !toDate) return;
    const params = new URLSearchParams();
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    router.push(`/admin/analytics?${params.toString()}`);
  };

  return (
    <div className={styles.filterWrapper}>
      {/* Mode Switcher / Presets */}
      <div className={styles.periodFilter}>
        <button
          type="button"
          onClick={() => router.push("/admin/analytics?period=today")}
          className={`${styles.periodBtn} ${currentPeriod === "today" && !currentDate && !currentFrom ? styles.periodBtnActive : ""}`}
        >
          Сьогодні
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/analytics?period=7d")}
          className={`${styles.periodBtn} ${currentPeriod === "7d" && !currentDate && !currentFrom ? styles.periodBtnActive : ""}`}
        >
          7 днів
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/analytics?period=30d")}
          className={`${styles.periodBtn} ${currentPeriod === "30d" && !currentDate && !currentFrom ? styles.periodBtnActive : ""}`}
        >
          30 днів
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/analytics?period=all")}
          className={`${styles.periodBtn} ${currentPeriod === "all" && !currentDate && !currentFrom ? styles.periodBtnActive : ""}`}
        >
          Весь час
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "single" ? "preset" : "single")}
          className={`${styles.periodBtn} ${currentDate || mode === "single" ? styles.periodBtnActive : ""}`}
          title="Вибрати конкретний день"
        >
          <Calendar size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
          Один день
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "range" ? "preset" : "range")}
          className={`${styles.periodBtn} ${(currentFrom || currentTo || mode === "range") && !currentDate ? styles.periodBtnActive : ""}`}
          title="Вибрати довільний проміжок дат"
        >
          Проміжок
        </button>
      </div>

      {/* Single Date Picker Panel */}
      {mode === "single" && (
        <div className={styles.customDateCard}>
          <div className={styles.customDateRow}>
            <label className={styles.dateLabel}>
              <span>Дата:</span>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className={styles.dateInput}
                max={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <button
              type="button"
              onClick={handleApplySingleDate}
              className={styles.applyBtn}
            >
              <Check size={14} />
              <span>Показати</span>
            </button>
          </div>
        </div>
      )}

      {/* Range Date Picker Panel */}
      {mode === "range" && (
        <div className={styles.customDateCard}>
          <div className={styles.customDateRow}>
            <label className={styles.dateLabel}>
              <span>Від:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.dateInput}
                max={toDate || new Date().toISOString().slice(0, 10)}
              />
            </label>
            <label className={styles.dateLabel}>
              <span>До:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={styles.dateInput}
                min={fromDate}
                max={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <button
              type="button"
              onClick={handleApplyRange}
              className={styles.applyBtn}
            >
              <Check size={14} />
              <span>Застосувати</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
