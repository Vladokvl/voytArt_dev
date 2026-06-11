import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import PostEditForm from "./_editForm";
import PostMediaSection from "./_MediaSection";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.galleryPost.findUnique({
    where: { id: Number(id) },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!post) notFound();
  return (
    <>
      <PostEditForm post={post} />
      <PostMediaSection postId={post.id} items={post.media} />
    </>
  );
}
