import { db } from "~/lib/db";
import GalleryHero from "~/components/gallery/GalleryHero";
import OurStory from "~/components/gallery/OurStory";
import GalleryPosts from "~/components/gallery/GalleryPosts";

export default async function GalleryPage() {
  const limit = 6;
  const posts = await db.galleryPost.findMany({
    orderBy: { date: "desc" },
    take: limit,
    select: { id: true, title: true, content: true, coverUrl: true, date: true },
  });

  const total = await db.galleryPost.count();
  const hasMore = posts.length < total;

  return (
    <div>
      <GalleryHero />
      <OurStory />
      <GalleryPosts initialPosts={posts} initialHasMore={hasMore} limit={limit} />
    </div>
  );
}
