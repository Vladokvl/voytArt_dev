import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import PostHero from "~/components/gallery/posts/PostHero";
import PostContent from "~/components/gallery/posts/PostContent";
import PostMedia from "~/components/gallery/posts/PostMedia";
import JsonLd from "~/components/seo/JsonLd";
import { siteUrl } from "~/lib/site-url";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const post = await db.galleryPost.findUnique({
    where: { id: Number(postId) },
    select: { title: true, content: true, coverUrl: true },
  });
  if (!post) return {};
  const description = post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 160).trim();
  return {
    title: `${post.title} | VoytArt Gallery`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.coverUrl
        ? [
            {
              url: post.coverUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverUrl ? [post.coverUrl] : [],
    },
  };
}

export default async function GalleryPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await db.galleryPost.findUnique({
    where: { id: Number(postId) },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!post) notFound();

  // Schema.org Article — структуровані дані для Rich Snippets
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: `${siteUrl}/gallery/${post.id}`,
    ...(post.coverUrl ? { image: [post.coverUrl] } : {}),
    datePublished: (post.date ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "VoytArt Gallery",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "VoytArt Gallery",
      url: siteUrl,
    },
  };

  return (
    <div>
      <JsonLd schema={articleJsonLd} />
      <PostHero post={post} />
      <PostContent post={post} />
      <PostMedia items={post.media} />
    </div>
  );
}
