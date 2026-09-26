import { unstable_cache } from "next/cache";
import { db } from "~/lib/db";
import { CACHE_TAGS } from "~/lib/cache-tags";
import enFallback from "../messages/en.json";
import ukFallback from "../messages/uk.json";

export type MessagesObject = Record<string, unknown>;

function deepMerge(target: MessagesObject, source: MessagesObject): MessagesObject {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key] as MessagesObject, source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: unknown): item is MessagesObject {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

/**
 * Отримує загальні налаштування сайту (режим Coming Soon тощо) з кешуванням.
 */
export const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const setting = await db.siteSetting.findFirst();
      if (!setting) {
        return {
          comingSoonMode: false,
          notifyEmail: null,
          senderEmail: "notifications@contact.voytart.com",
          notifyOnOrders: true,
          notifyOnInquiries: true,
          notifyCustomerOnOrder: true,
        };
      }
      return {
        comingSoonMode: setting.comingSoonMode,
        notifyEmail: setting.notifyEmail,
        senderEmail: setting.senderEmail ?? "notifications@contact.voytart.com",
        notifyOnOrders: setting.notifyOnOrders ?? true,
        notifyOnInquiries: setting.notifyOnInquiries ?? true,
        notifyCustomerOnOrder: setting.notifyCustomerOnOrder ?? true,
      };
    } catch (e) {
      console.error("Помилка завантаження налаштувань сайту:", e);
      return {
        comingSoonMode: false,
        notifyEmail: null,
        senderEmail: "notifications@contact.voytart.com",
        notifyOnOrders: true,
        notifyOnInquiries: true,
        notifyCustomerOnOrder: true,
      };
    }
  },
  ["site-settings"],
  {
    revalidate: 60, // 1 хвилина fallback
    tags: [CACHE_TAGS.settings],
  }
);

/**
 * Отримує активні переклади з бази даних (з дефолтом на локальні JSON-файли) з кешуванням.
 */
export const getCachedTranslations = unstable_cache(
  async () => {
    try {
      const activeVersion = await db.translationVersion.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });

      if (!activeVersion) {
        return {
          en: enFallback,
          uk: ukFallback,
        };
      }

      const mergedEn = deepMerge(
        enFallback,
        (activeVersion.dataEn as MessagesObject) ?? {}
      );
      const mergedUk = deepMerge(
        ukFallback,
        (activeVersion.dataUk as MessagesObject) ?? {}
      );

      return {
        en: mergedEn,
        uk: mergedUk,
      };
    } catch (e) {
      console.error("Помилка завантаження перекладів з БД:", e);
      return {
        en: enFallback,
        uk: ukFallback,
      };
    }
  },
  ["site-translations"],
  {
    revalidate: 60,
    tags: [CACHE_TAGS.translations],
  }
);

/**
 * Перевіряє, чи активний режим Coming Soon. Якщо активний, і користувач не адмін
 * та не має cookie Preview, перенаправляє на головну сторінку.
 */
export async function checkComingSoonGuard(locale = "uk"): Promise<void> {
  const settings = await getCachedSiteSettings();
  if (!settings.comingSoonMode) return;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isPreview = cookieStore.get("voytart_preview")?.value === "true";
  if (isPreview) return;

  const { redirect } = await import("next/navigation");
  redirect(`/${locale}`);
}

