import ArtHero from "../../../components/art/ArtHero";
import PaintingCard from "~/components/ui/PaintingCard/PaintingCard";
import CollectionFilter from "../../../components/art/CollectionFilter";
import { db } from "~/lib/db";
import styles from "./art.module.scss";

export default async function ArtPage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string; collection?: string }>;
}) {
  const { artist, collection } = await searchParams;
  const isArtistSelected = !!artist;
  const selectedAuthorId = artist ? Number(artist) : null;
  const selectedCollectionId = collection ? Number(collection) : null;

  const [paintings, authors, collections] = await Promise.all([
    db.painting.findMany({
      where: {
        ...(selectedAuthorId ? { authorId: selectedAuthorId } : {}),
        ...(selectedCollectionId ? { collectionId: selectedCollectionId } : {}),
      },
      include: {
        author: true,
        media: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.author.findMany({ orderBy: { id: "asc" }, take: 2 }),
    selectedAuthorId
      ? db.collection.findMany({
          where: { authorId: selectedAuthorId },
          orderBy: { title: "asc" },
        })
      : Promise.resolve([]),
  ]);

  const leftAuthor = authors[0];
  const rightAuthor = authors[1];
  const selectedAuthor = selectedAuthorId
    ? authors.find((a) => a.id === selectedAuthorId)
    : null;

  return (
    <div
      className={`${styles.wrapper} ${!isArtistSelected ? styles.lockedScroll : ""}`}
    >
      <ArtHero
        leftAuthorId={leftAuthor?.id ?? 0}
        rightAuthorId={rightAuthor?.id ?? 0}
        artistParam={artist ?? null}
      />

      <section className={styles.gallery}>
        <h2 className={styles.galleryTitle}>
          {selectedAuthor ? `${selectedAuthor.firstName} — Works` : "Our Paintings"}
        </h2>

        {collections.length > 0 && (
          <CollectionFilter
            collections={collections}
            selectedId={selectedCollectionId}
            artistParam={artist ?? null}
          />
        )}

        {paintings.length === 0 ? (
          <p className={styles.empty}>Ще немає жодної картини.</p>
        ) : (
          <div className={styles.masonry}>
            {paintings.map((painting) => (
              <div key={painting.id} className={styles.masonryItem}>
                <PaintingCard painting={painting} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
