"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, User } from "lucide-react";
import styles from "../admin-table.module.scss";

type AuthorOption = { id: number; firstName: string; lastName: string };

export default function CollectionFilters({
  authors,
}: {
  authors: AuthorOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentAuthorId = searchParams.get("authorId") ?? "";

  const handleAuthorChange = (newAuthorId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newAuthorId) {
      params.set("authorId", newAuthorId);
    } else {
      params.delete("authorId");
    }
    params.delete("page");
    router.push(`/admin/collections?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/admin/collections");
  };

  const hasActiveFilters = Boolean(currentAuthorId);

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
