"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

export async function deletePaintingAction(id: number) {
  await requireAdmin();
  const painting: {
    coverUrl: string;
    coverPublicId: string;
    media: Array<{ url: string; publicId: string; type: "IMAGE" | "VIDEO" }>;
  } | null = await db.painting.findUnique({
    where: { id },
    select: {
      coverUrl: true,
      coverPublicId: true,
      media: { select: { url: true, publicId: true, type: true } },
    },
  });

  await db.painting.delete({ where: { id } });

  const deleteTasks: Promise<void>[] = [];

  const coverPublicId = painting?.coverPublicId ?? (painting?.coverUrl ? getPublicIdFromCloudinaryUrl(painting.coverUrl) : null);
  if (coverPublicId) {
    deleteTasks.push(deleteAsset(coverPublicId, "image"));
  }

  for (const media of painting?.media ?? []) {
    const publicId = media.publicId ?? getPublicIdFromCloudinaryUrl(media.url);
    if (!publicId) continue;

    const resourceType = media.type === "VIDEO" ? "video" : "image";
    deleteTasks.push(deleteAsset(publicId, resourceType));
  }

  await Promise.allSettled(deleteTasks);
  
  revalidatePath("/admin/paintings");
  revalidatePath("/admin");
  revalidatePath("/art");
}

export async function swapPaintingOrderAction(idA: number, idB: number) {
  await requireAdmin();
  const [a, b] = await Promise.all([
    db.painting.findUnique({ where: { id: idA }, select: { sortOrder: true } }),
    db.painting.findUnique({ where: { id: idB }, select: { sortOrder: true } }),
  ]);
  if (!a || !b) return;
  // Атомарний обмін порядком в межах однієї транзакції
  await db.$transaction([
    db.painting.update({ where: { id: idA }, data: { sortOrder: b.sortOrder } }),
    db.painting.update({ where: { id: idB }, data: { sortOrder: a.sortOrder } }),
  ]);
  revalidatePath("/admin/paintings");
  revalidatePath("/art");
}

export async function movePaintingToPositionAction(id: number, targetIndex: number) {
  await requireAdmin();
  const all = await db.painting.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true } });
  const without = all.filter((p) => p.id !== id);
  const clamped = Math.max(0, Math.min(targetIndex, without.length));
  without.splice(clamped, 0, { id });
  // Атомарне оновлення порядку — без race conditions та часткових оновлень
  await db.$transaction(
    without.map((p, i) =>
      db.painting.update({ where: { id: p.id }, data: { sortOrder: i } }),
    ),
  );
  revalidatePath("/admin/paintings");
  revalidatePath("/art");
}