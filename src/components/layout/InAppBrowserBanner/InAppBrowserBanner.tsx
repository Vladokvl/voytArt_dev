"use client";

import { useEffect, useState } from "react";
import styles from "./InAppBrowserBanner.module.scss";

export default function InAppBrowserBanner() {
  const [inAppName, setInAppName] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Перевіряємо чи користувач вже закривав банер у цій сесії
    const dismissed = sessionStorage.getItem("voyt_inapp_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const ua = navigator.userAgent || "";
    let detected: string | null = null;

    if (/telegram/i.test(ua)) {
      detected = "Telegram";
    } else if (/instagram/i.test(ua)) {
      detected = "Instagram";
    } else if (/fbav|fban/i.test(ua)) {
      detected = "Facebook";
    } else if (/micromessenger/i.test(ua)) {
      detected = "WeChat";
    } else if (/line/i.test(ua)) {
      detected = "Line";
    }

    if (detected) {
      setInAppName(detected);
    }
  }, []);

  if (!inAppName || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("voyt_inapp_dismissed", "true");
    } catch {
      // ignore
    }
  };

  const handleOpenSafari = () => {
    // Спроба відкрити в Safari на iOS або Chrome
    window.open(window.location.href, "_system");
  };

  return (
    <aside className={styles.banner} role="alert" aria-label="In-App Browser Warning">
      <div className={styles.content}>
        <strong>Вбудований браузер {inAppName}</strong>
        <span>Для плавної 60fps анімації та повного звуку відкрийте у Safari або Chrome</span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleOpenSafari}
          className={styles.openBtn}
        >
          Відкрити ↗
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className={styles.closeBtn}
          aria-label="Закрити повідомлення"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
