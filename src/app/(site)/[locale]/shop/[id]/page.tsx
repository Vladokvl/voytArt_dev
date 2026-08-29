import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { plainProduct } from "~/lib/plain-product";
import JsonLd from "~/components/seo/JsonLd";
import { siteUrl } from "~/lib/site-url";
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

  const ogDescription = `${Number(product.price)} € · ${product.category.name} · ${cleanDescription}`;

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

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      author: true,
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  // 3-Tier Recommendation Algorithm (Category -> Author -> Top Active Products)
  const sameCategoryProducts = await db.product.findMany({
    where: {
      id: { not: productId },
      categoryId: product.categoryId,
      isActive: true,
    },
    take: 4,
    include: {
      author: true,
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  let relatedProducts = [...sameCategoryProducts];

  // Tier 2: Fill remaining slots with same author products
  if (relatedProducts.length < 4) {
    const existingIds = [productId, ...relatedProducts.map((p) => p.id)];
    const sameAuthorProducts = await db.product.findMany({
      where: {
        id: { notIn: existingIds },
        authorId: product.authorId,
        isActive: true,
      },
      take: 4 - relatedProducts.length,
      include: {
        author: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    });
    relatedProducts = [...relatedProducts, ...sameAuthorProducts];
  }

  // Tier 3: Fallback with general active products
  if (relatedProducts.length < 4) {
    const existingIds = [productId, ...relatedProducts.map((p) => p.id)];
    const fallbackProducts = await db.product.findMany({
      where: {
        id: { notIn: existingIds },
        isActive: true,
      },
      take: 4 - relatedProducts.length,
      include: {
        author: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    });
    relatedProducts = [...relatedProducts, ...fallbackProducts];
  }

  // Schema.org Product + Offer — структуровані дані для Rich Snippets
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.coverUrl, ...product.images.map((i) => i.url)].filter(Boolean),
    description:
      product.description != null && product.description.trim() !== ""
        ? product.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)
        : `${product.title} by ${product.author.firstName} ${product.author.lastName}.`,
    category: product.category.name,
    brand: { "@type": "Brand", name: "VoytArt Gallery" },
    ...(product.stock > 0
      ? {
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/shop/${product.id}`,
            priceCurrency: "EUR",
            price: Number(product.price).toFixed(2),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd schema={productJsonLd} />
      <ProductView
        product={plainProduct(product)}
        relatedProducts={relatedProducts.map(plainProduct)}
      />
    </>
  );
}
