"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, User, Layers } from "lucide-react";
import styles from "../admin-table.module.scss";

type AuthorOption = { id: number; firstName: string; lastName: string };
type CollectionOption = { id: number; title: string; authorId: number };

export default function PaintingFilters({
  authors,
  collections,
}: {
  authors: AuthorOption[];
  collections: CollectionOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentAuthorId = searchParams.get("authorId") ?? "";
  const currentCollectionId = searchParams.get("collectionId") ?? "";

  // Якщо автора вибрано — показуємо тільки його колекції, інакше показуємо всі
  const filteredCollections = currentAuthorId
    ? collections.filter((c) => c.authorId === Number(currentAuthorId))
    : collections;

  const handleAuthorChange = (newAuthorId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newAuthorId) {
      params.set("authorId", newAuthorId);
    } else {
      params.delete("authorId");
    }

    // Якщо раніше вибрана колекція не належить новому автору — скидаємо її
    if (currentCollectionId && newAuthorId) {
      const match = collections.find(
        (c) => c.id === Number(currentCollectionId) && c.authorId === Number(newAuthorId),
      );
      if (!match) {
        params.delete("collectionId");
      }
    }
    router.push(`/admin/paintings?${params.toString()}`);
  };

  const handleCollectionChange = (newCollectionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCollectionId) {
      params.set("collectionId", newCollectionId);
    } else {
      params.delete("collectionId");
    }
    router.push(`/admin/paintings?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/admin/paintings");
  };

  const hasActiveFilters = Boolean(currentAuthorId || currentCollectionId);

  return (
    <div className={styles.filterBar}>
      {/* Фільтр по авторах */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <User size={14} color="#64748b" />
          <span>Автор:</span>
        </label>
        <select
          value={currentAuthorId}
          onChange={(e) => handleAuthorChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Всі автори ({authors.length})</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Фільтр по колекціях */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <Layers size={14} color="#64748b" />
          <span>Колекція:</span>
        </label>
        <select
          value={currentCollectionId}
          onChange={(e) => handleCollectionChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">
            {currentAuthorId
              ? `Всі колекції автора (${filteredCollections.length})`
              : `Всі колекції (${collections.length})`}
          </option>
          {filteredCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Кнопка скидання фільтрів */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className={styles.filterResetBtn}
          title="Скинути фільтри"
        >
          <X size={13} />
          <span>Скинути</span>
        </button>
      )}
    </div>
  );
}
