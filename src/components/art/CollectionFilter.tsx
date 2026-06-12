"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/app/art/[[...artistId]]/art.module.scss";

type Collection = {
  id: number;
  title: string;
  coverPhotoUrl: string | null;
};

export default function CollectionFilter({
  collections,
  selectedId,
  artistParam,
}: {
  collections: Collection[];
  selectedId: number | null;
  artistParam: string | null;
}) {
  const router = useRouter();

  function select(id: number | null) {
    const params = new URLSearchParams();
    if (artistParam) params.set("artist", artistParam);
    if (id !== null) params.set("collection", String(id));
    router.push("/art?" + params.toString());
  }

  return (
    <div className={styles.collectionFilter}>
      {/* "Всі роботи" — скидає фільтр колекції */}
      <button
        className={`${styles.collectionChip} ${selectedId === null ? styles.collectionChipActive : ""}`}
        onClick={() => select(null)}
      >
        <span className={styles.chipIconWrap}>
          <span className={styles.chipIconAll}>✦</span>
        </span>
        All paintings
      </button>

      {collections.map((col) => (
        <button
          key={col.id}
          className={`${styles.collectionChip} ${selectedId === col.id ? styles.collectionChipActive : ""}`}
          onClick={() => select(col.id)}
        >
          <span className={styles.chipIconWrap}>
            {col.coverPhotoUrl ? (
              <Image
                src={col.coverPhotoUrl}
                alt={col.title}
                width={32}
                height={32}
                className={styles.chipImg}
              />
            ) : (
              <span className={styles.chipImgPlaceholder} />
            )}
          </span>
          {col.title}
        </button>
      ))}
    </div>
  );
}
