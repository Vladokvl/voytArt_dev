"use server";
import { db } from "~/lib/db";

const MAX_LIMIT = 50;
const MAX_OFFSET = 10_000;

export async function fetchPaginatedPaintings(
  offset: number,
  limit: number,
  artistId?: number | null,
  collectionId?: number | null,
  isNeonMode?: boolean
) {
  const safeOffset = Number.isInteger(offset) && offset > 0 ? Math.min(offset, MAX_OFFSET) : 0;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_LIMIT) : 9;

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
      skip: safeOffset,
      take: safeLimit,
    }),
    db.painting.count({ where }),
  ]);

  return {
    paintings,
    hasMore: safeOffset + paintings.length < total,
  };
}
