"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, User, Tag } from "lucide-react";
import styles from "../admin-table.module.scss";

type AuthorOption = { id: number; firstName: string; lastName: string };
type CategoryOption = { id: number; name: string };

export default function ProductFilters({
  authors,
  categories,
}: {
  authors: AuthorOption[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentAuthorId = searchParams.get("authorId") ?? "";
  const currentCategoryId = searchParams.get("categoryId") ?? "";

  const handleAuthorChange = (newAuthorId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newAuthorId) {
      params.set("authorId", newAuthorId);
    } else {
      params.delete("authorId");
    }
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleCategoryChange = (newCategoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategoryId) {
      params.set("categoryId", newCategoryId);
    } else {
      params.delete("categoryId");
    }
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/admin/products");
  };

  const hasActiveFilters = Boolean(currentAuthorId || currentCategoryId);

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

      {/* Фільтр по категоріях */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <Tag size={14} color="#64748b" />
          <span>Категорія:</span>
        </label>
        <select
          value={currentCategoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Всі категорії ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
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
