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
  const shortDesc = (formData.get("shortDesc") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const photoPublicId = photoUrl ? (getPublicIdFromCloudinaryUrl(photoUrl) ?? "") : "";

  const bgPhotoUrl = (formData.get("bgPhotoUrl") as string) || null;
  const bgPhotoPublicId = bgPhotoUrl ? (getPublicIdFromCloudinaryUrl(bgPhotoUrl) ?? "") : "";

  // Автоматично виставляємо як останній у списку
  const maxOrderAgg = await db.author.aggregate({ _max: { order: true } });
  const order = (maxOrderAgg._max.order ?? -1) + 1;

  const active = formData.get("active") === "on";

  if (!firstName || !lastName) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.author.create({
    data: {
      firstName,
      lastName,
      bio,
      shortDesc,
      photoUrl,
      photoPublicId,
      bgPhotoUrl,
      bgPhotoPublicId,
      order,
      active,
    },
  });

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
  const shortDesc = (formData.get("shortDesc") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const photoPublicId = photoUrl ? (getPublicIdFromCloudinaryUrl(photoUrl) ?? "") : "";

  const bgPhotoUrl = (formData.get("bgPhotoUrl") as string) || null;
  const bgPhotoPublicId = bgPhotoUrl ? (getPublicIdFromCloudinaryUrl(bgPhotoUrl) ?? "") : "";
  const orderInput = formData.get("order");
  const order = orderInput !== null ? Number(orderInput) : undefined;
  const active = formData.get("active") === "on";

  if (!id || !firstName || !lastName) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  // Перевірка: якщо автора роблять неактивним, чи залишається мінімум 2 активних автори на сайті
  if (!active) {
    const otherActiveCount = await db.author.count({
      where: {
        active: true,
        id: { not: id },
      },
    });

    if (otherActiveCount < 2) {
      return {
        error: "Неможливо приховати автора: на сайті має бути мінімум 2 видимих автори для коректного відображення галереї.",
      };
    }
  }

  await db.author.update({
    where: { id },
    data: {
      firstName,
      lastName,
      bio,
      shortDesc,
      photoUrl,
      photoPublicId,
      bgPhotoUrl,
      bgPhotoPublicId,
      ...(order !== undefined ? { order } : {}),
      active,
    },
  });

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
      active: true,
      photoUrl: true,
      photoPublicId: true,
      bgPhotoUrl: true,
      bgPhotoPublicId: true,
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

  // Перевірка: якщо видаляють активного автора
  if (author.active) {
    const remainingActiveCount = await db.author.count({
      where: {
        active: true,
        id: { not: id },
      },
    });
    if (remainingActiveCount < 2) {
      throw new Error("Неможливо видалити автора: на сайті має бути мінімум 2 видимих автори.");
    }
  }

  await db.author.delete({ where: { id } });

  const deleteTasks: Promise<void>[] = [];

  const authorPhotoPublicId = author.photoPublicId ?? (author.photoUrl ? getPublicIdFromCloudinaryUrl(author.photoUrl) : null);
  if (authorPhotoPublicId) {
    deleteTasks.push(deleteAsset(authorPhotoPublicId, "image").catch(() => undefined));
  }

  const authorBgPhotoPublicId = author.bgPhotoPublicId ?? (author.bgPhotoUrl ? getPublicIdFromCloudinaryUrl(author.bgPhotoUrl) : null);
  if (authorBgPhotoPublicId) {
    deleteTasks.push(deleteAsset(authorBgPhotoPublicId, "image").catch(() => undefined));
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

export async function swapAuthorOrderAction(idA: number, idB: number) {
  const [a, b] = await Promise.all([
    db.author.findUnique({ where: { id: idA }, select: { order: true } }),
    db.author.findUnique({ where: { id: idB }, select: { order: true } }),
  ]);
  if (!a || !b) return;
  await Promise.all([
    db.author.update({ where: { id: idA }, data: { order: b.order } }),
    db.author.update({ where: { id: idB }, data: { order: a.order } }),
  ]);
  revalidatePath("/admin/authors");
  revalidatePath("/art");
}

export async function moveAuthorToPositionAction(id: number, targetIndex: number) {
  const all = await db.author.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const without = all.filter((p) => p.id !== id);
  const clamped = Math.max(0, Math.min(targetIndex, without.length));
  without.splice(clamped, 0, { id });
  await Promise.all(
    without.map((p, i) => db.author.update({ where: { id: p.id }, data: { order: i } })),
  );
  revalidatePath("/admin/authors");
  revalidatePath("/art");
}
