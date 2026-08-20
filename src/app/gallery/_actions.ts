"use server";
import { db } from "~/lib/db";

export async function fetchPaginatedPosts(offset: number, limit: number) {
  const posts = await db.galleryPost.findMany({
    orderBy: { date: "desc" },
    skip: offset,
    take: limit,
    select: { id: true, title: true, titleUk: true, content: true, contentUk: true, coverUrl: true, date: true },
  });

  const total = await db.galleryPost.count();

  return {
    posts,
    hasMore: offset + posts.length < total,
  };
}
