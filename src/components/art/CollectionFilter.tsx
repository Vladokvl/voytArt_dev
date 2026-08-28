"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import styles from "~/app/(site)/[locale]/art/[[...artistId]]/art.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";

type Collection = {
  id: number;
  title: string;
  titleUk?: string | null;
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
  const searchParams = useSearchParams();
  const { t, locale, getLocalizedHref } = useTranslation();
  const isNeon = searchParams.get("neon") === "true";

  function select(id: number | null) {
    const params = new URLSearchParams();
    if (artistParam) params.set("artist", artistParam);
    if (id !== null) params.set("collection", String(id));
    if (isNeon) params.set("neon", "true");
    router.push(getLocalizedHref("/art") + "?" + params.toString());
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
        {t("art.allPaintings")}
      </button>

      {collections.map((col) => {
        const colTitle = getLocalized(col, "title", locale);
        return (
          <button
            key={col.id}
            className={`${styles.collectionChip} ${selectedId === col.id ? styles.collectionChipActive : ""}`}
            onClick={() => select(col.id)}
          >
            <span className={styles.chipIconWrap}>
              {col.coverPhotoUrl ? (
                <Image
                  src={getOptimizedImageUrl(col.coverPhotoUrl, { preset: "thumb" })}
                  alt={colTitle}
                  width={32}
                  height={32}
                  className={styles.chipImg}
                />
              ) : (
                <span className={styles.chipIcon}>◈</span>
              )}
            </span>
            {colTitle}
          </button>
        );
      })}
    </div>
  );
}
