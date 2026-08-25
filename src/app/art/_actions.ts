"use server";
import { db } from "~/lib/db";

export async function fetchPaginatedPaintings(
  offset: number,
  limit: number,
  artistId?: number | null,
  collectionId?: number | null,
  isNeonMode?: boolean
) {
  const where = {
    ...(artistId ? { authorId: artistId } : {}),
    ...(collectionId ? { collectionId: collectionId } : {}),
    ...(isNeonMode ? { hasNeon: true } : {}),
  };

  const [paintings, total] = await Promise.all([
    db.painting.findMany({
      where,
      include: {
        author: true,
        media: { orderBy: { order: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
      skip: Math.max(0, offset),
      take: Math.min(50, Math.max(1, limit)),
    }),
    db.painting.count({ where }),
  ]);

  return {
    paintings,
    hasMore: offset + paintings.length < total,
  };
}
