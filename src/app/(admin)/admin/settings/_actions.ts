"use server";

import { db } from "~/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "~/lib/admin-guard";
import { CACHE_TAGS } from "~/lib/cache-tags";
import type { Prisma } from "~/lib/db";

export async function toggleComingSoonAction(
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const existing = await db.siteSetting.findFirst();
    if (existing) {
      await db.siteSetting.update({
        where: { id: existing.id },
        data: { comingSoonMode: enabled },
      });
    } else {
      await db.siteSetting.create({
        data: { comingSoonMode: enabled },
      });
    }

    revalidateTag(CACHE_TAGS.settings);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error("Помилка зміни режиму Coming Soon:", err);
    return { success: false, error: "Не вдалося зберегти режим. Спробуйте ще раз." };
  }
}

export async function saveTranslationVersionAction(
  _prev: { success?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  const name = (formData.get("versionName") as string)?.trim() || null;
  const jsonEnRaw = formData.get("jsonEn") as string;
  const jsonUkRaw = formData.get("jsonUk") as string;

  if (!jsonEnRaw || !jsonUkRaw) {
    return { error: "Дані перекладів порожні або пошкоджені." };
  }

  let dataEn: Prisma.InputJsonValue;
  let dataUk: Prisma.InputJsonValue;

  try {
    dataEn = JSON.parse(jsonEnRaw) as Prisma.InputJsonValue;
    dataUk = JSON.parse(jsonUkRaw) as Prisma.InputJsonValue;
  } catch (err) {
    console.error("JSON parse error:", err);
    return { error: "Некоректний формат JSON перекладів." };
  }

  try {
    // Всі попередні версії деактивуємо
    await db.translationVersion.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Створюємо нову активну версію
    await db.translationVersion.create({
      data: {
        name,
        dataEn,
        dataUk,
        isActive: true,
      },
    });

    revalidateTag(CACHE_TAGS.translations);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("Помилка збереження версії перекладів:", err);
    return { error: "Не вдалося зберегти версію в базі даних. Спробуйте ще раз." };
  }
}

export async function activateTranslationVersionAction(
  versionId: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const version = await db.translationVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      return { success: false, error: "Версію не знайдено." };
    }

    // Деактивуємо всі інші версії
    await db.translationVersion.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Активуємо обрану
    await db.translationVersion.update({
      where: { id: versionId },
      data: { isActive: true },
    });

    revalidateTag(CACHE_TAGS.translations);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("Помилка активації версії перекладів:", err);
    return { success: false, error: "Не вдалося активувати версію. Спробуйте ще раз." };
  }
}
