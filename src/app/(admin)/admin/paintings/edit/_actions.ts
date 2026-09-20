"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

export async function updatePaintingAction(_prev: { error: string } | undefined, formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const authorId = Number(formData.get("authorId"));
  const coverUrl = (formData.get("coverUrl") as string) || "";
  if (!id || !title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  const oldPainting = await db.painting.findUnique({
    where: { id },
    select: { coverUrl: true },
  });

  if (!oldPainting) {
    return { error: "Цю картину вже було видалено іншим користувачем на іншому пристрої." };
  }

  if (oldPainting.coverUrl && coverUrl && oldPainting.coverUrl !== coverUrl) {
    const { deleteAssetByUrl } = await import("~/lib/cloudinary");
    void deleteAssetByUrl(oldPainting.coverUrl);
  }

  try {
    await db.painting.update({
      where: { id },
      data: {
        title,
        titleUk: (formData.get("titleUk") as string)?.trim() || null,
        authorId,
        description: (formData.get("description") as string) || null,
        descriptionUk: (formData.get("descriptionUk") as string) || null,
        year: formData.get("year") ? Number(formData.get("year")) : null,
        hasNeon: formData.get("hasNeon") === "on",
        isForSale: formData.get("isForSale") === "on",
        collectionId: formData.get("collectionId") ? Number(formData.get("collectionId")) : null,
        coverUrl: coverUrl || undefined,
        coverPublicId: coverUrl ? (getPublicIdFromCloudinaryUrl(coverUrl) ?? "") : undefined,
      },
    });
  } catch (err) {
    console.error("Помилка оновлення картини:", err);
    return { error: "Не вдалося оновити картину: запис було видалено або змінено іншим користувачем." };
  }

  revalidatePath("/admin/paintings");
  revalidatePath("/art");
  redirect("/admin/paintings");
}