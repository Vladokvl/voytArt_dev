"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

export async function createPostAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const content = formData.get("content") as string;
  const contentUk = (formData.get("contentUk") as string) || null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const coverPublicId = coverUrl ? (getPublicIdFromCloudinaryUrl(coverUrl) ?? "") : "";
  const dateRaw = formData.get("date") as string;
  const date = dateRaw ? new Date(dateRaw) : null;

  if (!title || !content) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.galleryPost.create({ data: { title, titleUk, content, contentUk, coverUrl, coverPublicId, date } });

  revalidatePath("/admin/posts");
  revalidatePath("/gallery");
  redirect("/admin/posts");
}

export async function updatePostAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const content = formData.get("content") as string;
  const contentUk = (formData.get("contentUk") as string) || null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const coverPublicId = coverUrl ? (getPublicIdFromCloudinaryUrl(coverUrl) ?? "") : "";
  const dateRaw = formData.get("date") as string;
  const date = dateRaw ? new Date(dateRaw) : null;

  if (!id || !title || !content) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.galleryPost.update({ where: { id }, data: { title, titleUk, content, contentUk, coverUrl, coverPublicId, date } });

  revalidatePath("/admin/posts");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${id}`);
  redirect("/admin/posts");
}

export async function deletePostAction(id: number): Promise<void> {
  await requireAdmin();
  const post: {
    coverUrl: string | null;
    coverPublicId: string;
    media: Array<{ url: string; publicId: string; type: "IMAGE" | "VIDEO" }>;
  } | null = await db.galleryPost.findUnique({
    where: { id },
    select: {
      coverUrl: true,
      coverPublicId: true,
      media: { select: { url: true, publicId: true, type: true } },
    },
  });

  await db.galleryPost.delete({ where: { id } });

  const deleteTasks: Promise<void>[] = [];

  const coverPublicId = post?.coverPublicId ?? (post?.coverUrl ? getPublicIdFromCloudinaryUrl(post.coverUrl) : null);
  if (coverPublicId) {
    deleteTasks.push(deleteAsset(coverPublicId, "image"));
  }

  for (const media of post?.media ?? []) {
    const publicId = media.publicId ?? getPublicIdFromCloudinaryUrl(media.url);
    if (!publicId) continue;

    const resourceType = media.type === "VIDEO" ? "video" : "image";
    deleteTasks.push(deleteAsset(publicId, resourceType));
  }

  await Promise.allSettled(deleteTasks);

  revalidatePath("/admin/posts");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${id}`);
}
