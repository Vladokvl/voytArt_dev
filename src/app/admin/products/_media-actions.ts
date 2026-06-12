"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function addProductMediaAction(formData: FormData) {
  const productId = parseInt(formData.get("productId") as string, 10);
  const url = formData.get("url") as string;
  if (!productId || !url) return;

  const publicId = getPublicIdFromCloudinaryUrl(url) ?? "";
  
  // Find highest order to append
  const maxOrder = await db.productImage.aggregate({
    where: { productId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  await db.productImage.create({
    data: {
      url,
      publicId,
      order: nextOrder,
      productId,
    },
  });

  revalidatePath(`/admin/products/edit/${productId}`);
}

export async function deleteProductMediaAction(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10);
  const productId = parseInt(formData.get("productId") as string, 10);
  if (!id || !productId) return;

  const media = await db.productImage.findUnique({ where: { id } });
  if (!media) return;

  const publicId = media.publicId || getPublicIdFromCloudinaryUrl(media.url);
  if (publicId) {
    await deleteAsset(publicId, "image");
  }

  await db.productImage.delete({ where: { id } });

  revalidatePath(`/admin/products/edit/${productId}`);
}
