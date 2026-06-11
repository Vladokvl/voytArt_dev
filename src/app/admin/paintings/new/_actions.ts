"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function createPaintingAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const title = formData.get("title") as string;
  const authorId = Number(formData.get("authorId"));
  const coverUrl = formData.get("coverUrl") as string;

  if (!title || !authorId || !coverUrl) {
    return { error: "Заповніть всі обовʼязкові поля" };
  }

  const maxOrder = await db.painting.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  await db.painting.create({
    data: {
      title,
      authorId,
      coverUrl,
      coverPublicId: getPublicIdFromCloudinaryUrl(coverUrl) ?? "",
      description: (formData.get("description") as string) || null,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      hasNeon: formData.get("hasNeon") === "on",
      isForSale: formData.get("isForSale") === "on",
      collectionId: formData.get("collectionId") ? Number(formData.get("collectionId")) : null,
      sortOrder: nextOrder,
    },
  });

  revalidatePath("/admin/paintings");
  redirect("/admin/paintings");
}
