"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

export async function addProductMediaAction(formData: FormData) {
  await requireAdmin();
  const productId = parseInt(formData.get("productId") as string, 10);
  const url = formData.get("url") as string;
  const rawVariantId = formData.get("variantId") as string;
  const variantId = rawVariantId ? parseInt(rawVariantId, 10) : null;

  if (!productId || !url) return;

  const publicId = getPublicIdFromCloudinaryUrl(url) ?? "";
  
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
      variantId: variantId && !isNaN(variantId) ? variantId : null,
    },
  });

  revalidatePath(`/admin/products/edit/${productId}`);
  revalidatePath(`/shop/${productId}`);
}

export async function updateProductMediaVariantAction(id: number, productId: number, variantId: number | null) {
  await requireAdmin();
  if (!id || !productId) return;

  await db.productImage.update({
    where: { id },
    data: {
      variantId: variantId && !isNaN(variantId) ? variantId : null,
    },
  });

  revalidatePath(`/admin/products/edit/${productId}`);
  revalidatePath(`/shop/${productId}`);
}

export async function deleteProductMediaAction(formData: FormData) {
  await requireAdmin();
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
  revalidatePath(`/shop/${productId}`);
}
