"use server";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategoryAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  const exists = await db.category.findUnique({ where: { slug } });
  if (exists) return { error: "Категорія з таким slug вже існує" };

  await db.category.create({ data: { name, slug } });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!id || !name || !slug) {
    return { error: "Заповніть обовʼязкові поля" };
  }

  const exists = await db.category.findFirst({ where: { slug, NOT: { id } } });
  if (exists) return { error: "Категорія з таким slug вже існує" };

  await db.category.update({ where: { id }, data: { name, slug } });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: number): Promise<void> {
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
