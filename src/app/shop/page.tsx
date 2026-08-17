import { db } from "~/lib/db";
import ShopStorefront from "./_ShopStorefront";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Магазин | VoytArt Gallery",
  description: "Оригінальний мерч, принти та сувеніри від українських художників галереї VoytArt",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: {
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
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
