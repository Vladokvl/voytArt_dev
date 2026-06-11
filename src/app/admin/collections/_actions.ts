"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function createCollectionAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const title = formData.get("title") as string;
  const authorId = Number(formData.get("authorId"));
  const coverPhotoUrl = (formData.get("coverPhotoUrl") as string) || null;
  const coverPhotoPublicId = coverPhotoUrl ? (getPublicIdFromCloudinaryUrl(coverPhotoUrl) ?? "") : "";

  if (!title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.collection.create({
    data: { title, authorId, coverPhotoUrl, coverPhotoPublicId },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  redirect("/admin/collections");
}

export async function updateCollectionAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const authorId = Number(formData.get("authorId"));
  const coverPhotoUrl = (formData.get("coverPhotoUrl") as string) || null;
  const coverPhotoPublicId = coverPhotoUrl ? (getPublicIdFromCloudinaryUrl(coverPhotoUrl) ?? "") : "";

  if (!id || !title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.collection.update({
    where: { id },
    data: { title, authorId, coverPhotoUrl, coverPhotoPublicId },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  redirect("/admin/collections");
}

export async function deleteCollectionAction(id: number): Promise<void> {
  const collection = await db.collection.findUnique({
    where: { id },
    select: { coverPhotoUrl: true, coverPhotoPublicId: true },
  });

  await db.collection.delete({ where: { id } });

  const publicId =
    collection?.coverPhotoPublicId ??
    (collection?.coverPhotoUrl ? getPublicIdFromCloudinaryUrl(collection.coverPhotoUrl) : null);
  if (publicId) {
    await deleteAsset(publicId, "image").catch(() => undefined);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
}
