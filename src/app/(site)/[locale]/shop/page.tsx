import { Suspense } from "react";
import { db } from "~/lib/db";
import { plainProduct } from "~/lib/plain-product";
import { checkComingSoonGuard } from "~/lib/site-settings";
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

export default async function ShopPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale ?? "uk";
  await checkComingSoonGuard(locale);

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
        author: {
          select: { id: true, firstName: true, firstNameUk: true, lastName: true, lastNameUk: true },
        },
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <Suspense fallback={null}>
      <ShopStorefront
        initialProducts={products.map(plainProduct)}
        categories={categories}
      />
    </Suspense>
  );
}
