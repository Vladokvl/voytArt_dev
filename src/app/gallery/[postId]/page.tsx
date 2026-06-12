import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import PostHero from "~/components/gallery/posts/PostHero";
import PostContent from "~/components/gallery/posts/PostContent";
import PostMedia from "~/components/gallery/posts/PostMedia";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const post = await db.galleryPost.findUnique({
    where: { id: Number(postId) },
    select: { title: true, content: true },
  });
  if (!post) return {};
  const description = post.content.replace(/<[^>]*>/g, " ").slice(0, 160).trim();
  return {
    title: `${post.title} | VoytArt Gallery`,
    description,
    openGraph: {
      title: post.title,
      description,
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

  return (
    <div>
      <PostHero title={post.title} coverUrl={post.coverUrl} date={post.date} />
      <PostContent content={post.content} />
      <PostMedia items={post.media} />
    </div>
  );
}
