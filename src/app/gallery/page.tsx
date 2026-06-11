import { db } from "~/lib/db";
import GalleryHero from "~/components/gallery/GalleryHero";
import OurStory from "~/components/gallery/OurStory";
import GalleryPosts from "~/components/gallery/GalleryPosts";

export default async function GalleryPage() {
  const posts = await db.galleryPost.findMany({
    orderBy: { date: "desc" },
    select: { id: true, title: true, content: true, coverUrl: true, date: true },
  });

  return (
    <div>
      <GalleryHero />
      <OurStory />
      <GalleryPosts posts={posts} />
    </div>
  );
}
