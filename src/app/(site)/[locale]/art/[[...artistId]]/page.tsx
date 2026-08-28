import ArtHero from "~/components/art/ArtHero";
import CollectionFilter from "~/components/art/CollectionFilter";
import NeonToggle from "~/components/art/NeonToggle";
import PaintingGrid from "~/components/art/PaintingGrid";
import ArtGalleryTitle from "~/components/art/ArtGalleryTitle";
import JsonLd from "~/components/seo/JsonLd";
import { db } from "~/lib/db";
import { parseIdParam } from "~/lib/parse-id";
import styles from "./art.module.scss";
import { type Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string; collection?: string }>;
}): Promise<Metadata> {
  const { artist, collection } = await searchParams;

  if (artist) {
    const artistId = parseIdParam(artist);
    const author = artistId
      ? await db.author.findUnique({
          where: { id: artistId },
          select: { firstName: true, lastName: true, bio: true, photoUrl: true },
        })
      : null;
    if (author) {
      const name = `${author.firstName} ${author.lastName}`;
      const desc = author.bio ?? `Original contemporary paintings and collections by ${name}.`;
      return {
        title: `${name} — Artworks & Paintings`,
        description: desc,
        openGraph: {
          title: `${name} — VoytArt Gallery`,
          description: desc,
          images: author.photoUrl
            ? [{ url: author.photoUrl, width: 800, height: 800, alt: name }]
            : [{ url: "/pagesImages/galleryPageHero.jpg", width: 1200, height: 630, alt: name }],
        },
      };
    }
  }

  if (collection) {
    const collectionId = parseIdParam(collection);
    const coll = collectionId
      ? await db.collection.findUnique({
          where: { id: collectionId },
          select: {
            title: true,
            coverPhotoUrl: true,
            author: { select: { firstName: true, lastName: true } },
          },
        })
      : null;
    if (coll) {
      const desc = `Art collection "${coll.title}" by ${coll.author.firstName} ${coll.author.lastName}.`;
      return {
        title: `Collection: ${coll.title} — ${coll.author.firstName} ${coll.author.lastName}`,
        description: desc,
        openGraph: {
          title: `Collection: ${coll.title}`,
          description: desc,
          images: coll.coverPhotoUrl
            ? [{ url: coll.coverPhotoUrl, width: 1200, height: 630, alt: coll.title }]
            : [],
        },
      };
    }
  }

  return {
    title: "Art Gallery — Original Paintings & Collections",
    description: "Explore curated original paintings and contemporary art collections by Ukrainian artists.",
    openGraph: {
      title: "VoytArt Gallery — Contemporary Paintings",
      description: "Explore curated original paintings and contemporary art collections by Ukrainian artists.",
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
}

export default async function ArtPage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string; collection?: string; neon?: string }>;
}) {
  const { artist, collection, neon } = await searchParams;
  const isNeonMode = neon === "true";
  const selectedAuthorId = parseIdParam(artist);
  const selectedCollectionId = parseIdParam(collection);
  const isArtistSelected = artist !== undefined && artist !== "";

  const limit = 9;
  const [paintings, totalPaintings, authors, collections] = await Promise.all([
    db.painting.findMany({
      where: {
        ...(selectedAuthorId ? { authorId: selectedAuthorId } : {}),
        ...(selectedCollectionId ? { collectionId: selectedCollectionId } : {}),
        ...(isNeonMode ? { hasNeon: true } : {}),
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
        ...(isNeonMode ? { hasNeon: true } : {}),
      },
    }),
    db.author.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    selectedAuthorId
      ? db.collection.findMany({
          where: { authorId: selectedAuthorId },
          orderBy: { title: "asc" },
        })
      : Promise.resolve([]),
  ]);

  const selectedAuthor = selectedAuthorId
    ? authors.find((a) => a.id === selectedAuthorId)
    : null;

  const hasMore = paintings.length < totalPaintings;

  // Schema.org ItemList из VisualArtwork — структуровані дані для Rich Snippets
  const paintingsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: paintings.length,
    itemListElement: paintings.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VisualArtwork",
        name: p.title,
        image: p.coverUrl,
        creator: {
          "@type": "Person",
          name: `${p.author.firstName} ${p.author.lastName}`,
        },
        ...(p.description
          ? {
              description: p.description
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 300),
            }
          : {}),
        ...(p.year ? { dateCreated: String(p.year) } : {}),
      },
    })),
  };

  return (
    <div
      className={`${styles.wrapper} ${!isArtistSelected ? styles.lockedScroll : ""}`}
      data-neon-mode={isNeonMode ? "true" : undefined}
    >
      <JsonLd schema={paintingsJsonLd} />
      <Suspense fallback={null}>
        <ArtHero
          artistParam={artist ?? null}
          authors={authors}
        />
      </Suspense>

      <section className={styles.gallery}>
        <div className={styles.galleryHeader}>
          <ArtGalleryTitle
            selectedAuthor={selectedAuthor ? { firstName: selectedAuthor.firstName, firstNameUk: selectedAuthor.firstNameUk } : null}
            className={styles.galleryTitle}
          />
          <Suspense fallback={null}>
            <NeonToggle />
          </Suspense>
        </div>

        {collections.length > 0 && (
          <CollectionFilter
            collections={collections}
            selectedId={selectedCollectionId}
            artistParam={artist ?? null}
          />
        )}

        <Suspense fallback={null}>
          <PaintingGrid
            initialPaintings={paintings}
            initialHasMore={hasMore}
            limit={limit}
            artistId={selectedAuthorId}
            collectionId={selectedCollectionId}
          />
        </Suspense>
      </section>
    </div>
  );
}
