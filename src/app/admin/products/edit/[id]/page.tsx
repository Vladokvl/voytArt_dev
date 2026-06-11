import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import ProductEditForm from "../../_editForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, authors, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: Number(id) },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    db.author.findMany({ orderBy: { lastName: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return <ProductEditForm product={product} authors={authors} categories={categories} />;
}
