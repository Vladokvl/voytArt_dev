import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import ProductView from "./_ProductView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id: Number(id) },
    include: { author: true, category: true },
  });

  if (!product) {
    return { title: "Product Not Found | VoytArt Store" };
  }

  const artistName = `${product.author.firstName} ${product.author.lastName}`;
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    : `${product.title} by ${artistName}. Exclusive Ukrainian contemporary art edition.`;

  const ogDescription = `${product.price} € · ${product.category.name} · ${cleanDescription}`;

  return {
    title: `${product.title} by ${artistName}`,
    description: ogDescription,
    openGraph: {
      title: `${product.title} — ${artistName}`,
      description: ogDescription,
      type: "article",
      images: product.coverUrl
        ? [
            {
              url: product.coverUrl,
              width: 1000,
              height: 1000,
              alt: `${product.title} by ${artistName}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — ${artistName}`,
      description: ogDescription,
      images: product.coverUrl ? [product.coverUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const [product, relatedProducts] = await Promise.all([
    db.product.findUnique({
      where: { id: productId },
      include: {
        author: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.product.findMany({
      where: { id: { not: productId }, isActive: true },
      take: 4,
      include: {
        author: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} relatedProducts={relatedProducts} />;
}
