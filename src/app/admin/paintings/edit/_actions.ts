"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function updatePaintingAction(_prev: { error: string } | undefined, formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const authorId = Number(formData.get("authorId"));
  const coverUrl = (formData.get("coverUrl") as string) || "";
  if (!id || !title || !authorId) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.painting.update({
    where: { id },
    data: {
      title,
      authorId,
      description: (formData.get("description") as string) || null,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      hasNeon: formData.get("hasNeon") === "on",
      isForSale: formData.get("isForSale") === "on",
      collectionId: formData.get("collectionId") ? Number(formData.get("collectionId")) : null,
      coverUrl: coverUrl || undefined,
      coverPublicId: coverUrl ? (getPublicIdFromCloudinaryUrl(coverUrl) ?? "") : undefined,
    },
  });

  revalidatePath("/admin/paintings");
  revalidatePath("/art");
  redirect("/admin/paintings");
}