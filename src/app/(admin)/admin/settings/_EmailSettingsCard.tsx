"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertTriangle, Send, Save, Info } from "lucide-react";
import styles from "./settings.module.scss";
import { saveEmailSettingsAction, sendTestEmailAction } from "./_actions";

interface EmailSettingsCardProps {
  initialNotifyEmail: string | null;
  initialSenderEmail: string | null;
  initialNotifyOnOrders: boolean;
  initialNotifyOnInquiries: boolean;
  initialNotifyCustomerOnOrder: boolean;
  isResendConfigured: boolean;
}

export default function EmailSettingsCard({
  initialNotifyEmail,
  initialSenderEmail,
  initialNotifyOnOrders,
  initialNotifyOnInquiries,
  initialNotifyCustomerOnOrder,
  isResendConfigured,
}: EmailSettingsCardProps) {
  const [notifyEmail, setNotifyEmail] = useState(initialNotifyEmail ?? "");
  const [senderEmail, setSenderEmail] = useState(
    initialSenderEmail ?? "notifications@contact.voytart.com"
  );
  const [notifyOnOrders, setNotifyOnOrders] = useState(initialNotifyOnOrders ?? true);
  const [notifyOnInquiries, setNotifyOnInquiries] = useState(initialNotifyOnInquiries ?? true);
  const [notifyCustomerOnOrder, setNotifyCustomerOnOrder] = useState(
    initialNotifyCustomerOnOrder ?? true
  );

  const [isSaving, startSaveTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  const [testEmail, setTestEmail] = useState(initialNotifyEmail ?? "");
  const [isSendingTest, startTestTransition] = useTransition();
  const [testStatus, setTestStatus] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus(null);

    startSaveTransition(async () => {
      const res = await saveEmailSettingsAction({
        notifyEmail,
        senderEmail,
        notifyOnOrders,
        notifyOnInquiries,
        notifyCustomerOnOrder,
      });

      if (res.success) {
        setSaveStatus({ type: "success", msg: "Налаштування пошти успішно збережено!" });
        if (!testEmail && notifyEmail) {
          setTestEmail(notifyEmail);
        }
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({ type: "error", msg: res.error ?? "Не вдалося зберегти налаштування" });
      }
    });
  }

  async function handleSendTest() {
    if (!testEmail?.includes("@")) {
      setTestStatus({
        type: "error",
        msg: "Будь ласка, вкажіть коректний email для відправки тестового листа.",
      });
      return;
    }

    setTestStatus(null);
    startTestTransition(async () => {
      const res = await sendTestEmailAction(testEmail);
      if (res.success) {
        setTestStatus({
          type: "success",
          msg: `Тестовий лист успішно надіслано на ${testEmail}! Перевірте Вхідні або Спам.`,
        });
      } else {
        setTestStatus({
          type: "error",
          msg: `Помилка Resend: ${res.error ?? "Невідома помилка"}`,
        });
      }
    });
  }

  return (
    <div className={styles.emailCard}>
      {/* ── Status Banner ── */}
      <div
        className={`${styles.emailStatusBanner} ${
          isResendConfigured ? styles.statusOk : styles.statusMissing
        }`}
      >
        {isResendConfigured ? (
          <CheckCircle2 size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
        ) : (
          <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {isResendConfigured
              ? "Resend API підключено (знайдено ключ у .env)"
              : "Ключ RESEND_API не знайдено в .env"}
          </div>
          <div style={{ fontSize: "0.82rem", marginTop: "0.25rem", opacity: 0.9 }}>
            {isResendConfigured
              ? "Система готова до надсилання електронних листів про замовлення та запити на картини."
              : "Додайте RESEND_API=re_... у ваш файл .env, щоб активувати відправку листів."}
          </div>
        </div>
      </div>

      {/* ── How it works Info Box ── */}
      <div className={styles.emailInfoBox}>
        <h4>
          <Info size={16} color="#2563eb" />
          Як працює пошта та відповіді клієнтам:
        </h4>
        <ul>
          <li>
            <strong>Відправник (From):</strong> Листи надсилаються через поштовий сервіс Resend з
            вашого підтвердженого домену <code>notifications@contact.voytart.com</code>.
          </li>
          <li>
            <strong>Отримувач (To):</strong> Листи приходять на пошту, вказану нижче (наприклад,
            ваш особистий <code>@gmail.com</code>).
          </li>
          <li>
            <strong>Швидка відповідь (Reply-To):</strong> В листах про нове замовлення чи запит
            адреса покупця автоматично підставляється як поле <code>Reply-To</code>. Ви можете
            просто натиснути <strong>«Відповісти»</strong> у своєму Gmail, і відповідь піде прямо
            клієнту.
          </li>
          <li>
            <strong>Тип ключа Resend:</strong> Ключ з типом <em>Full Access</em> дає право
            надсилати з будь-якого підтвердженого домену вашого акаунту Resend.
          </li>
        </ul>
      </div>

      {/* ── Settings Form ── */}
      <form onSubmit={handleSaveSettings} className={styles.emailFormGrid}>
        <div className={styles.formFieldGroup}>
          <label className={styles.fieldLabel} htmlFor="notifyEmailInput">
            Email для сповіщень адміністратора (To):
          </label>
          <input
            id="notifyEmailInput"
            type="email"
            className={styles.textInput}
            placeholder="admin@gmail.com"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
          />
          <span className={styles.fieldHint}>
            Куди надсилати сповіщення при появі нового замовлення чи запиту на картину. Можна вказати
            будь-яку пошту (Gmail, Ukr.net тощо).
          </span>
        </div>

        <div className={styles.formFieldGroup}>
          <label className={styles.fieldLabel} htmlFor="senderEmailInput">
            Адреса відправника (From):
          </label>
          <input
            id="senderEmailInput"
            type="text"
            className={styles.textInput}
            placeholder="notifications@contact.voytart.com або VoytArt <notifications@contact.voytart.com>"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <span className={styles.fieldHint}>
            Має належати верифікованому домену в Resend (наприклад:{" "}
            <code>notifications@contact.voytart.com</code>).
          </span>
        </div>

        <div className={styles.formFieldGroup}>
          <span className={styles.fieldLabel}>Події для надсилання сповіщень:</span>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={Boolean(notifyOnOrders)}
              onChange={(e) => setNotifyOnOrders(e.target.checked)}
            />
            <div className={styles.checkboxLabel}>
              Нові замовлення з магазину (Shop Orders)
              <span>Лист із списком куплених товарів, сумою, адресою доставки та коментарем</span>
            </div>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={Boolean(notifyOnInquiries)}
              onChange={(e) => setNotifyOnInquiries(e.target.checked)}
            />
            <div className={styles.checkboxLabel}>
              Нові запити на картини (Painting Inquiries)
              <span>Лист із фотографією картини, автором, ціною, контактами та повідомленням клієнта</span>
            </div>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={Boolean(notifyCustomerOnOrder)}
              onChange={(e) => setNotifyCustomerOnOrder(e.target.checked)}
            />
            <div className={styles.checkboxLabel}>
              Підтвердження замовлення для клієнта (Customer Order Confirmation)
              <span>Автоматичний брендовий лист клієнту його мовою (UK / EN) із переліком куплених товарів, сумою та контактами галереї</span>
            </div>
          </label>
        </div>

        {saveStatus && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              background: saveStatus.type === "error" ? "#fef2f2" : "#f0fdf4",
              border:
                saveStatus.type === "error" ? "1px solid #fecaca" : "1px solid #bbf7d0",
              color: saveStatus.type === "error" ? "#991b1b" : "#166534",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {saveStatus.msg}
          </div>
        )}

        <div>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            <Save size={16} />
            <span>{isSaving ? "Збереження..." : "Зберегти налаштування пошти"}</span>
          </button>
        </div>
      </form>

      {/* ── Test Email Section ── */}
      <div className={styles.testSection}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
            Тестовий лист
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Перевірте зв’язок із Resend, надіславши тестове повідомлення з брендовим дизайном VoytArt
            на вказану пошту.
          </div>
        </div>

        <div className={styles.testControls}>
          <input
            type="email"
            className={styles.textInput}
            style={{ flex: "1 1 250px" }}
            placeholder="Введіть email для перевірки (наприклад admin@gmail.com)"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <button
            type="button"
            className={styles.testBtn}
            onClick={handleSendTest}
            disabled={isSendingTest || !testEmail}
          >
            <Send size={15} />
            <span>{isSendingTest ? "Надсилання..." : "Надіслати тестовий лист"}</span>
          </button>
        </div>

        {testStatus && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              background: testStatus.type === "error" ? "#fef2f2" : "#f0fdf4",
              border:
                testStatus.type === "error" ? "1px solid #fecaca" : "1px solid #bbf7d0",
              color: testStatus.type === "error" ? "#991b1b" : "#166534",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {testStatus.msg}
          </div>
        )}
      </div>
    </div>
  );
}
