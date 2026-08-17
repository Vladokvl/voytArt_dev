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
    include: { author: true },
  });

  if (!product) {
    return { title: "Товар не знайдено | VoytArt Shop" };
  }

  return {
    title: `${product.title} | VoytArt Shop`,
    description: product.description?.slice(0, 150) ?? `${product.title} від ${product.author.firstName} ${product.author.lastName}`,
    openGraph: {
      title: `${product.title} | VoytArt Shop`,
      description: `${product.price} € — ${product.author.firstName} ${product.author.lastName}`,
      images: product.coverUrl ? [{ url: product.coverUrl }] : [],
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
