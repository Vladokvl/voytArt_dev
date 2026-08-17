"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

type VariantInput = {
  id?: number;
  title: string;
  price?: number | null;
  stock: number;
  sku?: string | null;
};

export async function createProductAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const baseStock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isFeatured = formData.get("isFeatured") === "on";
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

  // Calculate total stock: if variants exist, sum of variant stocks; otherwise baseStock
  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (isNaN(baseStock) ? 0 : baseStock);

  await db.product.create({
    data: {
      title,
      description,
      price,
      stock: totalStock,
      sortOrder,
      isFeatured,
      authorId,
      categoryId,
      coverUrl,
      coverPublicId: getPublicIdFromCloudinaryUrl(coverUrl) ?? "",
      ...(variants.length > 0
        ? {
            variants: {
              create: variants.map((v, i) => ({
                title: v.title,
                price: v.price ? Number(v.price) : null,
                stock: Number(v.stock) || 0,
                sku: v.sku || null,
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
  const description = (formData.get("description") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const baseStock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isFeatured = formData.get("isFeatured") === "on";
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
    description,
    price,
    stock: totalStock,
    sortOrder,
    isFeatured,
    authorId,
    categoryId,
  };

  if (coverUrl) {
    dataToUpdate.coverUrl = coverUrl;
    dataToUpdate.coverPublicId = getPublicIdFromCloudinaryUrl(coverUrl) ?? "";

    // Attempt to delete old cover from Cloudinary
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

  // Sync variants: replace all variants for this product
  await db.productVariant.deleteMany({ where: { productId: id } });
  if (variants.length > 0) {
    await db.productVariant.createMany({
      data: variants.map((v, i) => ({
        productId: id,
        title: v.title,
        price: v.price ? Number(v.price) : null,
        stock: Number(v.stock) || 0,
        sku: v.sku || null,
        sortOrder: i,
      })),
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/shop/${id}`);
  revalidatePath("/shop");
  redirect("/admin/products");
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
