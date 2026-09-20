"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PaintingCard from "~/components/ui/PaintingCard/PaintingCard";
import styles from "~/app/(site)/[locale]/art/[[...artistId]]/art.module.scss";
import { fetchPaginatedPaintings } from "~/app/(site)/[locale]/art/_actions";
import { useTranslation } from "~/context/LanguageContext";

type MediaItem = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

type Painting = {
  id: number;
  authorId?: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  coverUrl: string;
  year: number | null;
  isForSale?: boolean;
  author: { id?: number; firstName: string; firstNameUk?: string | null; lastName: string; lastNameUk?: string | null };
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
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isNeon = searchParams.get("neon") === "true";

  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [columnsCount, setColumnsCount] = useState<number>(3);

  // Responsive column count matching breakpoints
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setColumnsCount(1);
      } else if (w < 1024) {
        setColumnsCount(2);
      } else {
        setColumnsCount(3);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Stable round-robin distribution: newly loaded paintings only append to columns without moving previous items
  const columns = useMemo(() => {
    const cols: Painting[][] = Array.from({ length: columnsCount }, () => []);
    paintings.forEach((painting, index) => {
      cols[index % columnsCount]!.push(painting);
    });
    return cols;
  }, [paintings, columnsCount]);

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
        collectionId,
        isNeon
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
        <p className={styles.empty}>{t("art.empty")}</p>
      ) : (
        <>
          <div className={styles.masonryGrid}>
            {columns.map((col, colIdx) => (
              <div key={colIdx} className={styles.masonryColumn}>
                {col.map((painting) => (
                  <div key={painting.id} className={styles.masonryItem}>
                    <PaintingCard painting={painting} />
                  </div>
                ))}
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
                {loading ? t("art.loading") : t("art.showMore")}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
