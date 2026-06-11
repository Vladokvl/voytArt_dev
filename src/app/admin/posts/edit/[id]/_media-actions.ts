"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function addPostMediaAction(formData: FormData) {
  const postId = Number(formData.get("postId"));
  const url = formData.get("url") as string;
  const type = (formData.get("type") as string) === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!postId || !url) return { error: "Невірні дані" };

  const last = await db.galleryPostMedia.findFirst({
    where: { postId },
    orderBy: { order: "desc" },
  });

  await db.galleryPostMedia.create({
    data: {
      postId,
      url,
      publicId: getPublicIdFromCloudinaryUrl(url) ?? "",
      type,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/posts/edit/${postId}`);
  revalidatePath(`/gallery/${postId}`);
}

export async function deletePostMediaAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const postId = Number(formData.get("postId"));

  if (!id) return { error: "Невірні дані" };

  const media = await db.galleryPostMedia.findUnique({
    where: { id },
    select: { url: true, publicId: true, type: true },
  });

  await db.galleryPostMedia.delete({ where: { id } });

  const publicId = media?.publicId ?? (media?.url ? getPublicIdFromCloudinaryUrl(media.url) : null);
  if (publicId) {
    const resourceType = media?.type === "VIDEO" ? "video" : "image";
    await deleteAsset(publicId, resourceType).catch(() => undefined);
  }

  revalidatePath(`/admin/posts/edit/${postId}`);
  revalidatePath(`/gallery/${postId}`);
}
