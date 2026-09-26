import { db } from "~/lib/db";
import { getCachedSiteSettings } from "~/lib/site-settings";

export function getResendApiKey(): string {
  const primary = process.env.RESEND_API?.trim();
  if (primary) return primary;
  const secondary = process.env.RESEND_API_KEY?.trim();
  if (secondary) return secondary;
  return "";
}

export function isResendConfigured(): boolean {
  return getResendApiKey().length > 0;
}

interface SendEmailParams {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmailViaResend({
  from,
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { success: false, error: "RESEND_API ключ не знайдено в змінних середовища (.env)" };
  }

  const sender = from?.trim() ? from.trim() : "VoytArt Gallery <notifications@contact.voytart.com>";
  const recipients = Array.isArray(to) ? to : [to];

  try {
    const payload: Record<string, unknown> = {
      from: sender,
      to: recipients,
      subject,
      html,
    };

    if (replyTo?.trim()) {
      payload.reply_to = replyTo.trim();
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { id?: string; message?: string; name?: string };

    if (!response.ok) {
      const errDetail = data?.message ?? data?.name ?? `HTTP ${response.status}`;
      console.error("[Resend API Error]:", errDetail);
      return { success: false, error: errDetail };
    }

    return { success: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Resend Network Error]:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML Email Templates
// ─────────────────────────────────────────────────────────────────────────────

function emailWrapper(
  content: string,
  options?: { subtitle?: string; lang?: "uk" | "en"; footerText?: string }
): string {
  const lang = options?.lang ?? "uk";
  const subtitle =
    options?.subtitle ??
    (lang === "en" ? "System Notification" : "Системне сповіщення сайту");
  const footerText =
    options?.footerText ??
    (lang === "en"
      ? `© ${new Date().getFullYear()} VoytArt Gallery. All rights reserved.<br>Generated automatically by voytart.com`
      : `© ${new Date().getFullYear()} VoytArt Gallery. Усі права захищені.<br>Лист згенеровано автоматично сервером voytart.com`);

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VoytArt Gallery</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0b0b0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #161616; border: 1px solid #262626; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px 24px; background: #111111; border-bottom: 2px solid #d7ff01;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.12em; color: #ffffff; text-transform: uppercase;">VOYT ART GALLERY</h1>
              <p style="margin: 4px 0 0; font-size: 12px; color: #888888; letter-spacing: 0.05em; text-transform: uppercase;">${subtitle}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 32px 32px 28px;">
        ${content}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background: #111111; border-top: 1px solid #222222; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #666666;">
          ${footerText}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildTestEmailHtml(targetEmail: string): string {
  const time = new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Europe/Kyiv",
  }).format(new Date());

  const content = `
    <div style="background: rgba(215, 255, 1, 0.08); border: 1px solid rgba(215, 255, 1, 0.3); border-radius: 10px; padding: 18px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 8px; font-size: 18px; color: #d7ff01; font-weight: 700;">✅ Тестове підключення успішне!</h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #e2e8f0;">
        Інтеграція з Resend працює належним чином. Листи про нові замовлення з магазину та запити на картини будуть автоматично надходити на цю поштову скриньку.
      </p>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; width: 140px;">Отримувач:</td>
        <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${targetEmail}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8;">Час перевірки:</td>
        <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${time} (Київ)</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8;">Статус API:</td>
        <td style="padding: 6px 0; font-weight: 600; color: #10b981;">Підключено (OK)</td>
      </tr>
    </table>
  `;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Email Notification
// ─────────────────────────────────────────────────────────────────────────────

interface OrderForEmail {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  deliveryAddress: string;
  comment?: string | null;
  locale?: string | null;
  totalAmount: number | string | { toString(): string };
  createdAt: Date;
  items: Array<{
    title: string;
    variantTitle?: string | null;
    quantity: number;
    price: number | string | { toString(): string };
  }>;
}

export function buildOrderEmailHtml(order: OrderForEmail): string {
  const total = Number(order.totalAmount).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedDate = new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Kyiv",
  }).format(new Date(order.createdAt));

  const itemsRows = order.items
    .map((item) => {
      const itemPrice = Number(item.price);
      const rowSum = (itemPrice * item.quantity).toLocaleString("uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `
      <tr style="border-bottom: 1px solid #262626;">
        <td style="padding: 12px 8px; font-weight: 600; color: #ffffff;">
          ${item.title}
          ${item.variantTitle ? `<br><span style="font-size: 11px; color: #a1a1aa; font-weight: 400;">Варіант: ${item.variantTitle}</span>` : ""}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #cbd5e1;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #cbd5e1;">€${itemPrice.toFixed(2)}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #ffffff;">€${rowSum}</td>
      </tr>
    `;
    })
    .join("");

  const content = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background: #d7ff01; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">Нове замовлення</span>
      <h2 style="margin: 10px 0 4px; font-size: 22px; color: #ffffff; font-weight: 700;">Замовлення #${order.orderNumber}</h2>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">Оформлено: ${formattedDate} (Київ)</p>
    </div>

    <!-- Customer Card -->
    <div style="background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
      <h3 style="margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Клієнт та доставка</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; width: 140px;">ПІБ:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Телефон:</td>
          <td style="padding: 4px 0; font-weight: 600;"><a href="tel:${order.customerPhone}" style="color: #60a5fa; text-decoration: none;">${order.customerPhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Email:</td>
          <td style="padding: 4px 0; font-weight: 600;"><a href="mailto:${order.customerEmail}" style="color: #60a5fa; text-decoration: none;">${order.customerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Місто:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryCity}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Адреса / відділення:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryAddress}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Мова оформлення:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #d7ff01;">${order.locale === "en" ? "🇬🇧 English (EN)" : "🇺🇦 Українська (UK)"}</td>
        </tr>
        ${
          order.comment
            ? `
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; vertical-align: top;">Коментар:</td>
          <td style="padding: 4px 0; color: #facc15; font-style: italic;">«${order.comment}»</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <!-- Items Table -->
    <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Склад замовлення</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="border-bottom: 2px solid #333333; text-transform: uppercase; font-size: 11px; color: #888888;">
          <th style="padding: 8px 8px; text-align: left;">Товар</th>
          <th style="padding: 8px 8px; text-align: center; width: 40px;">К-ть</th>
          <th style="padding: 8px 8px; text-align: right; width: 75px;">Ціна</th>
          <th style="padding: 8px 8px; text-align: right; width: 85px;">Сума</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 16px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #ffffff;">Загальна сума:</td>
          <td style="padding: 16px 8px; text-align: right; font-size: 18px; font-weight: 800; color: #d7ff01;">€${total}</td>
        </tr>
      </tfoot>
    </table>
  `;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Painting Inquiry Email Notification
// ─────────────────────────────────────────────────────────────────────────────

interface InquiryForEmail {
  id: number;
  inquiryNumber: string;
  customerName: string;
  customerContact: string;
  preferredContact: string;
  message?: string | null;
  createdAt: Date;
  painting: {
    id: number;
    title: string;
    titleUk?: string | null;
    photoUrl?: string | null;
    price?: number | string | { toString(): string } | null;
    size?: string | null;
    author?: {
      firstName: string;
      lastName: string;
      firstNameUk?: string | null;
      lastNameUk?: string | null;
    } | null;
  };
}

export function buildInquiryEmailHtml(inquiry: InquiryForEmail): string {
  const formattedDate = new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Kyiv",
  }).format(new Date(inquiry.createdAt));

  const authorFirst = inquiry.painting.author?.firstNameUk ?? inquiry.painting.author?.firstName;
  const authorLast = inquiry.painting.author?.lastNameUk ?? inquiry.painting.author?.lastName;
  const authorName = authorFirst && authorLast ? `${authorFirst} ${authorLast}` : "VoytArt";

  const paintingTitle = inquiry.painting.titleUk ?? inquiry.painting.title;

  const content = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background: #c084fc; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">Запит на картину</span>
      <h2 style="margin: 10px 0 4px; font-size: 22px; color: #ffffff; font-weight: 700;">Запит ${inquiry.inquiryNumber}</h2>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">Отримано: ${formattedDate} (Київ)</p>
    </div>

    <!-- Artwork Card -->
    <div style="background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Обрана картина</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          ${
            inquiry.painting.photoUrl
              ? `
          <td style="width: 100px; vertical-align: top; padding-right: 18px;">
            <img src="${inquiry.painting.photoUrl}" alt="${paintingTitle}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #333;" />
          </td>
          `
              : ""
          }
          <td style="vertical-align: top;">
            <h4 style="margin: 0 0 4px; font-size: 17px; font-weight: 700; color: #ffffff;">${paintingTitle}</h4>
            <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Автор: <strong style="color: #ffffff;">${authorName}</strong></p>
            ${
              inquiry.painting.size
                ? `<p style="margin: 0 0 4px; font-size: 12px; color: #888888;">Розмір: ${inquiry.painting.size}</p>`
                : ""
            }
            ${
              inquiry.painting.price
                ? `<p style="margin: 0; font-size: 15px; font-weight: 800; color: #d7ff01;">€${Number(inquiry.painting.price).toFixed(2)}</p>`
                : ""
            }
          </td>
        </tr>
      </table>
    </div>

    <!-- Customer Card -->
    <div style="background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Дані замовника</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; width: 140px;">Ім'я:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${inquiry.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Контактні дані:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #60a5fa; font-size: 14px;">${inquiry.customerContact}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Бажаний зв'язок:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">
            <span style="display: inline-block; background: #2a2a2a; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${inquiry.preferredContact}</span>
          </td>
        </tr>
        ${
          inquiry.message
            ? `
        <tr>
          <td style="padding: 8px 0 4px; color: #94a3b8; vertical-align: top;">Повідомлення:</td>
          <td style="padding: 8px 0 4px; color: #f1f5f9; font-style: italic; line-height: 1.5;">«${inquiry.message}»</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
  `;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// High-Level Dispatchers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Безпечно надсилає сповіщення про нове замовлення адміністратору на пошту.
 * Ніколи не викидає помилок назовні, щоб не порушити клієнтський чекаут.
 */
export async function sendOrderNotificationEmail(orderId: number): Promise<void> {
  try {
    if (!isResendConfigured()) {
      console.warn("[Email Notification] RESEND_API не налаштовано, сповіщення пропущено.");
      return;
    }

    const settings = await getCachedSiteSettings();
    if (!settings.notifyOnOrders || !settings.notifyEmail) {
      return;
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return;

    const html = buildOrderEmailHtml(order);

    await sendEmailViaResend({
      from: settings.senderEmail ?? "VoytArt Gallery <notifications@contact.voytart.com>",
      to: settings.notifyEmail,
      subject: `🛒 Нове замовлення #${order.orderNumber} на суму €${Number(order.totalAmount).toFixed(2)}`,
      html,
      replyTo: order.customerEmail,
    });
  } catch (error) {
    console.error("[Email Notification Failed for Order #%d]:", orderId, error);
  }
}

/**
 * Будує адаптивний брендовий HTML-лист для клієнта мовою замовлення (UK або EN).
 */
export function buildCustomerOrderEmailHtml(order: OrderForEmail, locale: "uk" | "en"): string {
  const isEn = locale === "en";
  const formattedDate = new Intl.DateTimeFormat(isEn ? "en-GB" : "uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Kyiv",
  }).format(new Date(order.createdAt));

  const total = Number(order.totalAmount).toLocaleString(isEn ? "en-US" : "uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const itemsRows = order.items
    .map((item) => {
      const itemPrice = Number(item.price);
      const rowSum = (itemPrice * item.quantity).toLocaleString(isEn ? "en-US" : "uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `
      <tr style="border-bottom: 1px solid #262626;">
        <td style="padding: 12px 8px; font-weight: 600; color: #ffffff;">
          ${item.title}
          ${item.variantTitle ? `<br><span style="font-size: 11px; color: #a1a1aa; font-weight: 400;">${isEn ? "Variant:" : "Варіант:"} ${item.variantTitle}</span>` : ""}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #cbd5e1;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #cbd5e1;">€${itemPrice.toFixed(2)}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #ffffff;">€${rowSum}</td>
      </tr>
    `;
    })
    .join("");

  const content = isEn
    ? `
    <div style="background: rgba(215, 255, 1, 0.08); border: 1px solid rgba(215, 255, 1, 0.3); border-radius: 12px; padding: 22px; margin-bottom: 24px;">
      <span style="display: inline-block; background: #d7ff01; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">Order Placed</span>
      <h2 style="margin: 12px 0 6px; font-size: 22px; color: #ffffff; font-weight: 700;">Thank you for your order, ${order.customerName}!</h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #e2e8f0;">
        We have received your order <strong>${order.orderNumber}</strong>. Our manager will contact you shortly to confirm the details and shipping.
      </p>
    </div>

    <!-- Delivery & Order Info -->
    <div style="background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Delivery & Contact Details</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; width: 140px;">Recipient:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Phone:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.customerPhone}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">City:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryCity}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Address:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryAddress}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Date:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${formattedDate} (Kyiv time)</td>
        </tr>
        ${
          order.comment
            ? `
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; vertical-align: top;">Your comment:</td>
          <td style="padding: 4px 0; color: #facc15; font-style: italic;">«${order.comment}»</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <!-- Items Table -->
    <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Order Items</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="border-bottom: 2px solid #333333; text-transform: uppercase; font-size: 11px; color: #888888;">
          <th style="padding: 8px 8px; text-align: left;">Item</th>
          <th style="padding: 8px 8px; text-align: center; width: 40px;">Qty</th>
          <th style="padding: 8px 8px; text-align: right; width: 75px;">Price</th>
          <th style="padding: 8px 8px; text-align: right; width: 85px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 16px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #ffffff;">Total:</td>
          <td style="padding: 16px 8px; text-align: right; font-size: 18px; font-weight: 800; color: #d7ff01;">€${total}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background: #181818; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
      If you have questions about your order, reply directly to this email or reach us on Instagram: <strong>@voyt_art</strong>
    </div>
  `
    : `
    <div style="background: rgba(215, 255, 1, 0.08); border: 1px solid rgba(215, 255, 1, 0.3); border-radius: 12px; padding: 22px; margin-bottom: 24px;">
      <span style="display: inline-block; background: #d7ff01; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">Замовлення прийнято</span>
      <h2 style="margin: 12px 0 6px; font-size: 22px; color: #ffffff; font-weight: 700;">Дякуємо за замовлення, ${order.customerName}!</h2>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #e2e8f0;">
        Ми успішно отримали ваше замовлення <strong>${order.orderNumber}</strong>. Наш менеджер незабаром зв'яжеться з вами для підтвердження та уточнення деталей доставки.
      </p>
    </div>

    <!-- Delivery & Order Info -->
    <div style="background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Дані доставки та контакти</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; width: 140px;">Отримувач:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Телефон:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.customerPhone}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Місто:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryCity}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Адреса / відділення:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${order.deliveryAddress}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #94a3b8;">Дата:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${formattedDate} (за Києвом)</td>
        </tr>
        ${
          order.comment
            ? `
        <tr>
          <td style="padding: 4px 0; color: #94a3b8; vertical-align: top;">Ваш коментар:</td>
          <td style="padding: 4px 0; color: #facc15; font-style: italic;">«${order.comment}»</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <!-- Items Table -->
    <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #d7ff01; font-weight: 700;">Склад замовлення</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="border-bottom: 2px solid #333333; text-transform: uppercase; font-size: 11px; color: #888888;">
          <th style="padding: 8px 8px; text-align: left;">Товар</th>
          <th style="padding: 8px 8px; text-align: center; width: 40px;">К-ть</th>
          <th style="padding: 8px 8px; text-align: right; width: 75px;">Ціна</th>
          <th style="padding: 8px 8px; text-align: right; width: 85px;">Сума</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 16px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #ffffff;">Загальна сума:</td>
          <td style="padding: 16px 8px; text-align: right; font-size: 18px; font-weight: 800; color: #d7ff01;">€${total}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background: #181818; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
      Якщо у вас є запитання щодо замовлення, просто дайте відповідь на цей лист або напишіть нам в Instagram: <strong>@voyt_art</strong>
    </div>
  `;

  return emailWrapper(content, {
    lang: isEn ? "en" : "uk",
    subtitle: isEn ? "Order Confirmation" : "Підтвердження замовлення",
  });
}

/**
 * Безпечно надсилає лист-підтвердження замовлення клієнту його мовою (UK / EN).
 */
export async function sendCustomerOrderConfirmationEmail(orderId: number): Promise<void> {
  try {
    if (!isResendConfigured()) {
      return;
    }

    const settings = await getCachedSiteSettings();
    if (!settings.notifyCustomerOnOrder) {
      return;
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order?.customerEmail) return;

    const locale = order.locale === "en" ? "en" : "uk";
    const html = buildCustomerOrderEmailHtml(order, locale);
    const subject =
      locale === "en"
        ? `Order Confirmation #${order.orderNumber} | VoytArt Gallery`
        : `Підтвердження замовлення #${order.orderNumber} | VoytArt Gallery`;

    await sendEmailViaResend({
      from: settings.senderEmail ?? "VoytArt Gallery <notifications@contact.voytart.com>",
      to: order.customerEmail,
      subject,
      html,
      replyTo: settings.notifyEmail ?? undefined,
    });
  } catch (error) {
    console.error("[Customer Order Email Failed for Order #%d]:", orderId, error);
  }
}

/**
 * Безпечно надсилає сповіщення про новий запит на картину адміністратору на пошту.
 */
export async function sendInquiryNotificationEmail(inquiryId: number): Promise<void> {
  try {
    if (!isResendConfigured()) {
      console.warn("[Email Notification] RESEND_API не налаштовано, сповіщення пропущено.");
      return;
    }

    const settings = await getCachedSiteSettings();
    if (!settings.notifyOnInquiries || !settings.notifyEmail) {
      return;
    }

    const inquiry = await db.paintingInquiry.findUnique({
      where: { id: inquiryId },
      include: {
        painting: {
          include: { author: true },
        },
      },
    });

    if (!inquiry) return;

    const html = buildInquiryEmailHtml(inquiry);
    const paintingTitle = inquiry.painting.titleUk ?? inquiry.painting.title;

    await sendEmailViaResend({
      from: settings.senderEmail ?? "VoytArt Gallery <notifications@contact.voytart.com>",
      to: settings.notifyEmail,
      subject: `🎨 Новий запит на картину «${paintingTitle}» (${inquiry.inquiryNumber})`,
      html,
    });
  } catch (error) {
    console.error("[Email Notification Failed for Inquiry #%d]:", inquiryId, error);
  }
}
