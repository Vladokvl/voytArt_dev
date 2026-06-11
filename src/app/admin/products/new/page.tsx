import { db } from "~/lib/db";
import ProductForm from "./_form";

export default async function NewProductPage() {
  const [authors, categories] = await Promise.all([
    db.author.findMany({ orderBy: { lastName: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <ProductForm authors={authors} categories={categories} />;
}
