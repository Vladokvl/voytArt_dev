"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function createAuthorAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const bio = (formData.get("bio") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const photoPublicId = photoUrl ? (getPublicIdFromCloudinaryUrl(photoUrl) ?? "") : "";

  if (!firstName || !lastName) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.author.create({ data: { firstName, lastName, bio, photoUrl, photoPublicId } });

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/admin/collections/new");
  revalidatePath("/admin/products/new");
  redirect("/admin/authors");
}

export async function updateAuthorAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const id = Number(formData.get("id"));
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const bio = (formData.get("bio") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const photoPublicId = photoUrl ? (getPublicIdFromCloudinaryUrl(photoUrl) ?? "") : "";

  if (!id || !firstName || !lastName) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.author.update({ where: { id }, data: { firstName, lastName, bio, photoUrl, photoPublicId } });

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/admin/collections/new");
  revalidatePath("/admin/products/new");
  redirect("/admin/authors");
}

export async function deleteAuthorAction(id: number): Promise<void> {
  const author = await db.author.findUnique({
    where: { id },
    select: {
      photoUrl: true,
      photoPublicId: true,
      paintings: {
        select: {
          coverUrl: true,
          coverPublicId: true,
          media: { select: { url: true, publicId: true, type: true } },
        },
      },
      collections: {
        select: {
          coverPhotoUrl: true,
          coverPhotoPublicId: true,
        },
      },
      products: {
        select: {
          images: { select: { url: true, publicId: true } },
        },
      },
    },
  });

  if (!author) return;

  await db.author.delete({ where: { id } });

  const deleteTasks: Promise<void>[] = [];

  const authorPhotoPublicId = author.photoPublicId ?? (author.photoUrl ? getPublicIdFromCloudinaryUrl(author.photoUrl) : null);
  if (authorPhotoPublicId) {
    deleteTasks.push(deleteAsset(authorPhotoPublicId, "image").catch(() => undefined));
  }

  for (const collection of author.collections) {
    const collPublicId = collection.coverPhotoPublicId ?? (collection.coverPhotoUrl ? getPublicIdFromCloudinaryUrl(collection.coverPhotoUrl) : null);
    if (collPublicId) {
      deleteTasks.push(deleteAsset(collPublicId, "image").catch(() => undefined));
    }
  }

  for (const painting of author.paintings) {
    const paintingCoverPublicId = painting.coverPublicId ?? (painting.coverUrl ? getPublicIdFromCloudinaryUrl(painting.coverUrl) : null);
    if (paintingCoverPublicId) {
      deleteTasks.push(deleteAsset(paintingCoverPublicId, "image").catch(() => undefined));
    }
    for (const media of painting.media) {
      const mediaPublicId = media.publicId ?? getPublicIdFromCloudinaryUrl(media.url);
      if (mediaPublicId) {
        const resourceType = media.type === "VIDEO" ? "video" : "image";
        deleteTasks.push(deleteAsset(mediaPublicId, resourceType).catch(() => undefined));
      }
    }
  }

  for (const product of author.products) {
    for (const image of product.images) {
      const imagePublicId = image.publicId ?? getPublicIdFromCloudinaryUrl(image.url);
      if (imagePublicId) {
        deleteTasks.push(deleteAsset(imagePublicId, "image").catch(() => undefined));
      }
    }
  }

  void Promise.allSettled(deleteTasks);

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/admin/collections/new");
  revalidatePath("/admin/products/new");
  revalidatePath("/shop");
  revalidatePath("/art");
}
