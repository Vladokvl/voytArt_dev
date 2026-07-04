"use server";
import { db } from "~/lib/db";

export async function fetchPaginatedPaintings(
  offset: number,
  limit: number,
  artistId?: number | null,
  collectionId?: number | null,
  isNeonMode?: boolean
) {
  const paintings = await db.painting.findMany({
    where: {
      ...(artistId ? { authorId: artistId } : {}),
      ...(collectionId ? { collectionId: collectionId } : {}),
      ...(isNeonMode ? { hasNeon: true } : {}),
    },
    include: {
      author: true,
      media: { orderBy: { order: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
    skip: offset,
    take: limit,
  });

  const total = await db.painting.count({
    where: {
      ...(artistId ? { authorId: artistId } : {}),
      ...(collectionId ? { collectionId: collectionId } : {}),
      ...(isNeonMode ? { hasNeon: true } : {}),
    },
  });

  return {
    paintings,
    hasMore: offset + paintings.length < total,
  };
}
