"use client";
import { useState, useEffect } from "react";
import PaintingCard from "~/components/ui/PaintingCard/PaintingCard";
import styles from "~/app/art/[[...artistId]]/art.module.scss";
import { fetchPaginatedPaintings } from "~/app/art/_actions";

type MediaItem = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

type Painting = {
  id: number;
  title: string;
  description: string | null;
  coverUrl: string;
  year: number | null;
  author: { firstName: string; lastName: string };
  media: MediaItem[];
};

export default function PaintingGrid({
  initialPaintings,
  initialHasMore,
  limit,
  artistId,
  collectionId,
}: {
  initialPaintings: Painting[];
  initialHasMore: boolean;
  limit: number;
  artistId: number | null;
  collectionId: number | null;
}) {
  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  // Sync state with server-side changes (e.g. filter changes)
  useEffect(() => {
    setPaintings(initialPaintings);
    setHasMore(initialHasMore);
  }, [initialPaintings, initialHasMore]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetchPaginatedPaintings(
        paintings.length,
        limit,
        artistId,
        collectionId
      );
      setPaintings((prev) => [...prev, ...(res.paintings as Painting[])]);
      setHasMore(res.hasMore);
    } catch (error) {
      console.error("Failed to load more paintings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {paintings.length === 0 ? (
        <p className={styles.empty}>No paintings found.</p>
      ) : (
        <>
          <div className={styles.masonry}>
            {paintings.map((painting) => (
              <div key={painting.id} className={styles.masonryItem}>
                <PaintingCard painting={painting} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={loadMore}
                disabled={loading}
                className={styles.loadMoreBtn}
              >
                {loading ? "Loading..." : "Show more"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
