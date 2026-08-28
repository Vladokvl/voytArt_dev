"use server";
import { db } from "~/lib/db";

/** Жорсткі ліміти пагінації — захист від DoS довільними offset/limit */
const MAX_LIMIT = 24;
const MAX_OFFSET = 10_000;

export async function fetchPaginatedPosts(offset: number, limit: number) {
  // Валідація та клампінг вхідних чисел: будь-яке сміття від клієнта
  // перетворюється на безпечні значення замість необмеженої вибірки
  const safeOffset =
    Number.isInteger(offset) && offset > 0 ? Math.min(offset, MAX_OFFSET) : 0;
  const safeLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_LIMIT) : 12;

  const posts = await db.galleryPost.findMany({
    orderBy: { date: "desc" },
    skip: safeOffset,
    take: safeLimit,
    select: { id: true, title: true, titleUk: true, content: true, contentUk: true, coverUrl: true, date: true },
  });

  const total = await db.galleryPost.count();

  return {
    posts,
    hasMore: safeOffset + posts.length < total,
  };
}
