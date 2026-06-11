"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAsset, getPublicIdFromCloudinaryUrl } from "~/lib/cloudinary";

export async function createProductAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const imageUrls = formData.getAll("imageUrls") as string[];

  if (!title || !authorId || !categoryId || isNaN(price)) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.product.create({
    data: {
      title,
      description,
      price,
      stock: isNaN(stock) ? 0 : stock,
      sortOrder,
      authorId,
      categoryId,
      images: {
        create: imageUrls
          .filter(Boolean)
          .map((url, i) => ({ url, publicId: getPublicIdFromCloudinaryUrl(url) ?? "", order: i })),
      },
    },
  });

  revalidatePath("/admin/products");
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
  const stock = parseInt(formData.get("stock") as string, 10);
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const authorId = parseInt(formData.get("authorId") as string, 10);
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const imageUrls = formData.getAll("imageUrls") as string[];

  if (!id || !title || !authorId || !categoryId || isNaN(price)) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  await db.product.update({
    where: { id },
    data: {
      title,
      description,
      price,
      stock: isNaN(stock) ? 0 : stock,
      sortOrder,
      authorId,
      categoryId,
    },
  });

  if (imageUrls.length > 0) {
    const existingImages = await db.productImage.findMany({
      where: { productId: id },
      select: { url: true, publicId: true },
    });

    const nextUrlSet = new Set(imageUrls.filter(Boolean));
    const toDelete = existingImages.filter((img) => !nextUrlSet.has(img.url));

    await Promise.allSettled(
      toDelete.map((img) => {
        const publicId = img.publicId || getPublicIdFromCloudinaryUrl(img.url);
        if (!publicId) return Promise.resolve();
        return deleteAsset(publicId, "image");
      }),
    );

    await db.productImage.deleteMany({ where: { productId: id } });
    await db.productImage.createMany({
      data: imageUrls
        .filter(Boolean)
        .map((url, i) => ({
          url,
          publicId: getPublicIdFromCloudinaryUrl(url) ?? "",
          order: i,
          productId: id,
        })),
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: number): Promise<void> {
  const images = await db.productImage.findMany({
    where: { productId: id },
    select: { url: true, publicId: true },
  });

  await db.product.delete({ where: { id } });

  await Promise.allSettled(
    images.map((img) => {
      const publicId = img.publicId || getPublicIdFromCloudinaryUrl(img.url);
      if (!publicId) return Promise.resolve();
      return deleteAsset(publicId, "image");
    }),
  );

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
