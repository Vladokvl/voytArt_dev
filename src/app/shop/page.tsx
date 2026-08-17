import { db } from "~/lib/db";
import ShopStorefront from "./_ShopStorefront";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Store — Curated Editions & Apparel",
  description:
    "Explore exclusive prints, limited edition streetwear, and collectible design objects crafted by Ukrainian contemporary artists.",
  openGraph: {
    title: "VoytArt Store — Curated Art Editions & Apparel",
    description:
      "Exclusive art prints, limited apparel, and collectibles by contemporary Ukrainian artists.",
    images: [
      {
        url: "/pagesImages/galleryPageHero.jpg",
        width: 1200,
        height: 630,
        alt: "VoytArt Store",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
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
