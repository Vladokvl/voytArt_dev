"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createCollectionAction, updateCollectionAction } from "./_actions";
import { type Author } from "@/types/Author";
import styles from "../_formStyles.module.scss";
import ImageUploadField from "../_components/ImageUploadField";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";

export type CollectionItem = {
  id: number;
  title: string;
  titleUk?: string | null;
  authorId: number;
  coverPhotoUrl: string | null;
};

interface CollectionFormProps {
  collection?: CollectionItem;
  authors: Author[];
}

export default function CollectionForm({ collection, authors }: CollectionFormProps) {
  const isEdit = Boolean(collection);
  useSetBreadcrumb(collection?.title ?? "Нова колекція");

  const actionToUse = isEdit ? updateCollectionAction : createCollectionAction;
  const [state, formAction] = useActionState(actionToUse, undefined);

  const [pending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={styles.formHeaderSticky}>
        <div className={styles.headerTitleWrap}>
          <Link href="/admin/collections" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={styles.headerTitle}>
              {collection ? `Редагування колекції: ${collection.title}` : "Створення нової колекції"}
            </h1>
            {collection && (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                ID: #{collection.id}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending || isUploading}
        >
          <Save size={16} />
          <span>
            {isUploading
              ? "Завантаження фото..."
              : pending
                ? "Збереження..."
                : collection
                  ? "Зберегти"
                  : "Створити"}
          </span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {collection && <input type="hidden" name="id" value={String(collection.id)} />}

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={styles.formGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Основні параметри</h3>
              <span className={styles.cardDesc}>Назва та автор колекції</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Назва колекції (EN) *</label>
              <input
                className={styles.input}
                name="title"
                placeholder="Collection title in English"
                defaultValue={collection?.title ?? ""}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Назва колекції (Українська)</label>
              <input
                className={styles.input}
                name="titleUk"
                placeholder="Назва колекції українською"
                defaultValue={collection?.titleUk ?? ""}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Автор *</label>
              <select
                className={styles.select}
                name="authorId"
                defaultValue={collection?.authorId ? String(collection.authorId) : ""}
                required
              >
                <option value="">Оберіть автора</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Обкладинка колекції</h3>
            </div>

            <ImageUploadField
              name="coverPhotoUrl"
              label="Фото обкладинки"
              folder="voytart/collections"
              initialUrl={collection?.coverPhotoUrl}
              aspectRatio={16 / 9}
              helpText="Обкладинка для показу колекції (рекомендовано 16:9)"
              onUploadingChange={setIsUploading}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
