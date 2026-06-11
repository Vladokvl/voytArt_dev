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
    select: { photoUrl: true, photoPublicId: true },
  });

  await db.author.delete({ where: { id } });

  const publicId = author?.photoPublicId ?? (author?.photoUrl ? getPublicIdFromCloudinaryUrl(author.photoUrl) : null);
  if (publicId) {
    await deleteAsset(publicId, "image").catch(() => undefined);
  }

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
  revalidatePath("/admin/paintings/new");
  revalidatePath("/admin/collections/new");
  revalidatePath("/admin/products/new");
}
