"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

export async function createCollectionAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const authorId = Number(formData.get("authorId"));
  const coverPhotoUrl = (formData.get("coverPhotoUrl") as string) || null;
  const coverPhotoPublicId = coverPhotoUrl ? (getPublicIdFromCloudinaryUrl(coverPhotoUrl) ?? "") : "";

  if (!title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  try {
    await db.collection.create({
      data: { title, titleUk, authorId, coverPhotoUrl, coverPhotoPublicId },
    });
  } catch (err) {
    console.error("Помилка створення колекції:", err);
    return { error: "Не вдалося створити колекцію через затримку бази даних. Будь ласка, спробуйте ще раз." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/art");
  redirect("/admin/collections");
}

export async function updateCollectionAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const authorId = Number(formData.get("authorId"));
  const coverPhotoUrl = (formData.get("coverPhotoUrl") as string) || null;
  const coverPhotoPublicId = coverPhotoUrl ? (getPublicIdFromCloudinaryUrl(coverPhotoUrl) ?? "") : "";

  if (!id || !title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  const oldCollection = await db.collection.findUnique({
    where: { id },
    select: { coverPhotoUrl: true },
  });

  if (!oldCollection) {
    return { error: "Цю колекцію вже було видалено іншим користувачем на іншому пристрої." };
  }

  if (oldCollection.coverPhotoUrl && coverPhotoUrl && oldCollection.coverPhotoUrl !== coverPhotoUrl) {
    const { deleteAssetByUrl } = await import("~/lib/cloudinary");
    void deleteAssetByUrl(oldCollection.coverPhotoUrl);
  }

  try {
    await db.collection.update({
      where: { id },
      data: { title, titleUk, authorId, coverPhotoUrl, coverPhotoPublicId },
    });
  } catch (err) {
    console.error("Помилка оновлення колекції:", err);
    return { error: "Не вдалося оновити колекцію: запис було видалено або змінено іншим користувачем." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/art");
  redirect("/admin/collections");
}

export async function deleteCollectionAction(id: number): Promise<void> {
  await requireAdmin();
  const collection = await db.collection.findUnique({
    where: { id },
    select: { coverPhotoUrl: true, coverPhotoPublicId: true },
  });

  if (!collection) {
    revalidatePath("/admin/collections");
    revalidatePath("/admin");
    revalidatePath("/admin/paintings/new");
    return;
  }

  try {
    // Захист від P2003 (FK constraint failed): спершу обнуляємо посилання картин
    // на колекцію (relation nullable), потім видаляємо саму колекцію.
    await db.painting.updateMany({ where: { collectionId: id }, data: { collectionId: null } });
    await db.collection.delete({ where: { id } });
  } catch (err) {
    console.error("Помилка видалення колекції:", err);
    revalidatePath("/admin/collections");
    revalidatePath("/admin");
    revalidatePath("/admin/paintings/new");
    return;
  }

  const publicId =
    collection.coverPhotoPublicId ||
    (collection.coverPhotoUrl ? getPublicIdFromCloudinaryUrl(collection.coverPhotoUrl) : null);
  if (publicId) {
    await deleteAsset(publicId, "image").catch(() => undefined);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
}
