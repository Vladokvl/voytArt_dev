import { db } from "~/lib/db";
import GalleryHero from "~/components/gallery/GalleryHero";
import OurStory from "~/components/gallery/OurStory";
import GalleryPosts from "~/components/gallery/GalleryPosts";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery & Stories",
  description:
    "Explore exhibition highlights, behind-the-scenes stories, and artist profiles at VoytArt Gallery.",
  openGraph: {
    title: "VoytArt Gallery — Stories & Exhibitions",
    description:
      "Exhibition highlights, behind-the-scenes stories, and contemporary art events.",
    images: [
      {
        url: "/pagesImages/galleryPageHero.jpg",
        width: 1200,
        height: 630,
        alt: "VoytArt Gallery",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const limit = 6;
  const posts = await db.galleryPost.findMany({
    orderBy: { date: "desc" },
    take: limit,
    select: { id: true, title: true, titleUk: true, content: true, contentUk: true, coverUrl: true, date: true },
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
