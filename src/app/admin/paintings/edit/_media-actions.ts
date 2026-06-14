"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function addPaintingMediaAction(formData: FormData) {
  const paintingId = Number(formData.get("paintingId"));
  const url = formData.get("url") as string;
  const isNeon = formData.get("isNeon") === "true";
  const typeVal = formData.get("type") as string || "IMAGE";
  const type = typeVal === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!paintingId || !url) return { error: "Невірні дані" };

  const last = await db.paintingMedia.findFirst({
    where: { paintingId, isNeon },
    orderBy: { order: "desc" },
  });

  await db.paintingMedia.create({
    data: {
      paintingId,
      url,
      publicId: getPublicIdFromCloudinaryUrl(url) ?? "",
      isNeon,
      order: (last?.order ?? -1) + 1,
      type,
    },
  });

  revalidatePath(`/admin/paintings/edit/${paintingId}`);
  revalidatePath("/art");
}

export async function deletePaintingMediaAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const paintingId = Number(formData.get("paintingId"));

  if (!id) return { error: "Невірні дані" };

  const media = await db.paintingMedia.findUnique({
    where: { id },
    select: { url: true, publicId: true, type: true },
  });

  await db.paintingMedia.delete({ where: { id } });

  const publicId = media?.publicId ?? (media?.url ? getPublicIdFromCloudinaryUrl(media.url) : null);
  if (publicId) {
    const resourceType = media?.type === "VIDEO" ? "video" : "image";
    await deleteAsset(publicId, resourceType).catch(() => undefined);
  }

  revalidatePath(`/admin/paintings/edit/${paintingId}`);
  revalidatePath("/art");
}
