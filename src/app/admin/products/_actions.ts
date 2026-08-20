"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export type VariantInput = {
  id?: number;
  title: string;
  titleUk?: string | null;
  price?: number | string | null;
  stock: number | string;
  sku?: string | null;
};

export async function createProductAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const description = (formData.get("description") as string) || null;
  const descriptionUk = (formData.get("descriptionUk") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const baseStock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const coverUrl = formData.get("coverUrl") as string;
  const variantsJson = formData.get("variantsJson") as string;

  if (!title || !authorId || !categoryId || isNaN(price) || !coverUrl) {
    return { error: "Заповніть обовʼязкові поля (вкл. фото)" };
  }

  let variants: VariantInput[] = [];
  if (variantsJson) {
    try {
      variants = JSON.parse(variantsJson) as VariantInput[];
    } catch (e) {
      console.error("Failed to parse variants:", e);
    }
  }

  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (isNaN(baseStock) ? 0 : baseStock);

  await db.product.create({
    data: {
      title,
      titleUk,
      description,
      descriptionUk,
      price,
      stock: totalStock,
      sortOrder,
      isFeatured,
      isActive,
      authorId,
      categoryId,
      coverUrl,
      coverPublicId: getPublicIdFromCloudinaryUrl(coverUrl) ?? "",
      ...(variants.length > 0
        ? {
            variants: {
              create: variants.map((v, i) => ({
                title: v.title,
                titleUk: v.titleUk ?? null,
                price: v.price ? Number(v.price) : null,
                stock: Number(v.stock) || 0,
                sku: v.sku ?? null,
                sortOrder: i,
              })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const id = parseInt(formData.get("id") as string, 10);
  const title = formData.get("title") as string;
  const titleUk = (formData.get("titleUk") as string)?.trim() || null;
  const description = (formData.get("description") as string) || null;
  const descriptionUk = (formData.get("descriptionUk") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const baseStock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const coverUrl = formData.get("coverUrl") as string;
  const variantsJson = formData.get("variantsJson") as string;

  if (!id || !title || !authorId || !categoryId || isNaN(price)) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  let variants: VariantInput[] = [];
  if (variantsJson) {
    try {
      variants = JSON.parse(variantsJson) as VariantInput[];
    } catch (e) {
      console.error("Failed to parse variants:", e);
    }
  }

  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (isNaN(baseStock) ? 0 : baseStock);

  const dataToUpdate: Record<string, unknown> = {
    title,
    titleUk,
    description,
    descriptionUk,
    price,
    stock: totalStock,
    sortOrder,
    isFeatured,
    isActive,
    authorId,
    categoryId,
  };

  if (coverUrl) {
    dataToUpdate.coverUrl = coverUrl;
    dataToUpdate.coverPublicId = getPublicIdFromCloudinaryUrl(coverUrl) ?? "";

    const oldProduct = await db.product.findUnique({
      where: { id },
      select: { coverPublicId: true, coverUrl: true },
    });
    if (oldProduct && oldProduct.coverUrl !== coverUrl) {
      const publicId = oldProduct.coverPublicId || getPublicIdFromCloudinaryUrl(oldProduct.coverUrl);
      if (publicId) void deleteAsset(publicId, "image");
    }
  }

  await db.product.update({
    where: { id },
    data: dataToUpdate,
  });

  // SMART SYNC VARIANTS (Preserves existing variant IDs so photo attachments remain intact!)
  const existingVariants = await db.productVariant.findMany({
    where: { productId: id },
  });
  const existingMap = new Map(existingVariants.map((v) => [v.id, v]));
  const submittedIds = new Set<number>();

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]!;
    const vPrice = v.price !== "" && v.price !== null && v.price !== undefined ? Number(v.price) : null;
    const vStock = Number(v.stock) || 0;
    const vSku = v.sku ?? null;
    const vTitleUk = v.titleUk ?? null;

    if (v.id && existingMap.has(v.id)) {
      submittedIds.add(v.id);
      await db.productVariant.update({
        where: { id: v.id },
        data: {
          title: v.title,
          titleUk: vTitleUk,
          price: vPrice,
          stock: vStock,
          sku: vSku,
          sortOrder: i,
        },
      });
    } else {
      const created = await db.productVariant.create({
        data: {
          productId: id,
          title: v.title,
          titleUk: vTitleUk,
          price: vPrice,
          stock: vStock,
          sku: vSku,
          sortOrder: i,
        },
      });
      submittedIds.add(created.id);
    }
  }

  // Delete only removed variants
  const toDeleteIds = existingVariants
    .filter((v) => !submittedIds.has(v.id))
    .map((v) => v.id);

  if (toDeleteIds.length > 0) {
    await db.productVariant.deleteMany({
      where: { id: { in: toDeleteIds } },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/edit/${id}`);
  revalidatePath(`/shop/${id}`);
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function toggleProductActiveAction(id: number, isActive: boolean) {
  await db.product.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProductAction(id: number): Promise<void> {
  const images = await db.productImage.findMany({
    where: { productId: id },
    select: { url: true, publicId: true },
  });

  const product = await db.product.findUnique({
    where: { id },
    select: { coverUrl: true, coverPublicId: true },
  });

  await db.product.delete({ where: { id } });

  const toDelete = [...images];
  if (product?.coverUrl) {
    toDelete.push({ url: product.coverUrl, publicId: product.coverPublicId });
  }

  await Promise.allSettled(
    toDelete.map((img) => {
      const publicId = img.publicId || getPublicIdFromCloudinaryUrl(img.url);
      if (!publicId) return Promise.resolve();
      return deleteAsset(publicId, "image");
    }),
  );

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function swapProductOrderAction(idA: number, idB: number) {
  const [a, b] = await Promise.all([
    db.product.findUnique({ where: { id: idA }, select: { sortOrder: true } }),
    db.product.findUnique({ where: { id: idB }, select: { sortOrder: true } }),
  ]);
  if (!a || !b) return;
  await Promise.all([
    db.product.update({ where: { id: idA }, data: { sortOrder: b.sortOrder } }),
    db.product.update({ where: { id: idB }, data: { sortOrder: a.sortOrder } }),
  ]);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function moveProductToPositionAction(id: number, targetIndex: number) {
  const all = await db.product.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true } });
  const without = all.filter((p) => p.id !== id);
  const clamped = Math.max(0, Math.min(targetIndex, without.length));
  without.splice(clamped, 0, { id });
  await Promise.all(
    without.map((p, i) => db.product.update({ where: { id: p.id }, data: { sortOrder: i } })),
  );
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

