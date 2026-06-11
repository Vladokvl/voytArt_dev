import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import CategoryEditForm from "./_editForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id: Number(id) } });
  if (!category) notFound();
  return <CategoryEditForm category={category} />;
}
