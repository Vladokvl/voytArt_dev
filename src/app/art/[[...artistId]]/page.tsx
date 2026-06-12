import ArtHero from "../../../components/art/ArtHero";
import CollectionFilter from "../../../components/art/CollectionFilter";
import PaintingGrid from "~/components/art/PaintingGrid";
import { db } from "~/lib/db";
import styles from "./art.module.scss";
import { type Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string; collection?: string }>;
}): Promise<Metadata> {
  const { artist, collection } = await searchParams;

  if (artist) {
    const author = await db.author.findUnique({
      where: { id: Number(artist) },
      select: { firstName: true, lastName: true, bio: true },
    });
    if (author) {
      const name = `${author.firstName} ${author.lastName}`;
      const desc = author.bio ?? `Paintings by artist ${name}`;
      return {
        title: `${name} - Paintings | VoytArt Gallery`,
        description: desc,
        openGraph: {
          title: `${name} - Paintings`,
          description: desc,
        },
      };
    }
  }

  if (collection) {
    const coll = await db.collection.findUnique({
      where: { id: Number(collection) },
      select: { title: true, author: { select: { firstName: true, lastName: true } } },
    });
    if (coll) {
      const desc = `Collection "${coll.title}" by ${coll.author.firstName} ${coll.author.lastName}`;
      return {
        title: `Collection: ${coll.title} | VoytArt Gallery`,
        description: desc,
        openGraph: {
          title: `Collection: ${coll.title}`,
          description: desc,
        },
      };
    }
  }

  return {
    title: "Our Paintings | VoytArt Gallery",
    description: "Original paintings by Ukrainian artists",
  };
}

export default async function ArtPage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string; collection?: string }>;
}) {
  const { artist, collection } = await searchParams;
  const isArtistSelected = !!artist;
  const selectedAuthorId = artist ? Number(artist) : null;
  const selectedCollectionId = collection ? Number(collection) : null;

  const limit = 9;
  const [paintings, totalPaintings, authors, collections] = await Promise.all([
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
      take: limit,
    }),
    db.painting.count({
      where: {
        ...(selectedAuthorId ? { authorId: selectedAuthorId } : {}),
        ...(selectedCollectionId ? { collectionId: selectedCollectionId } : {}),
      },
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

  const hasMore = paintings.length < totalPaintings;

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

        <PaintingGrid
          initialPaintings={paintings}
          initialHasMore={hasMore}
          limit={limit}
          artistId={selectedAuthorId}
          collectionId={selectedCollectionId}
        />
      </section>
    </div>
  );
}
