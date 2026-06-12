import { db } from "~/lib/db";
import ShopStorefront from "./_ShopStorefront";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | VoytArt Gallery",
  description: "Browse and buy original art products by Ukrainian artists",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: {
        images: { orderBy: { order: "asc" } },
        author: true,
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ShopStorefront
      initialProducts={products}
      categories={categories}
    />
  );
}
