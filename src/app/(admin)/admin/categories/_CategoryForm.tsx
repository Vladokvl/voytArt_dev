"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { createCategoryAction, updateCategoryAction } from "./_actions";
import styles from "../_formStyles.module.scss";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";

type Category = { id: number; name: string; nameUk?: string | null; slug: string };

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoryForm({ category }: { category?: Category }) {
  const isEdit = Boolean(category);
  useSetBreadcrumb(category?.name ?? "Нова категорія");

  const actionToUse = isEdit ? updateCategoryAction : createCategoryAction;
  const [state, formAction] = useActionState(actionToUse, undefined);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => formAction(fd))}
      className={styles.form}
    >
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={styles.formHeaderSticky}>
        <div className={styles.headerTitleWrap}>
          <Link href="/admin/categories" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={styles.headerTitle}>
              {category ? `Редагування категорії: ${category.name}` : "Створення нової категорії"}
            </h1>
            {category && (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                ID: #{category.id}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={pending}>
          {category ? <Save size={16} /> : <Plus size={16} />}
          <span>{pending ? (isEdit ? "Збереження..." : "Створення...") : (isEdit ? "Зберегти" : "Створити")}</span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className={styles.card} style={{ maxWidth: 640 }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Дані категорії</h3>
          <span className={styles.cardDesc}>Назва та URL-ідентифікатор</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Назва категорії (EN) *</label>
          <input
            className={styles.input}
            name="name"
            defaultValue={category?.name ?? ""}
            placeholder="e.g. Prints & Art"
            required
            onChange={(e) => {
              if (!category) {
                const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slugInput && !slugInput.dataset.edited) {
                  slugInput.value = toSlug(e.target.value);
                }
              }
            }}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Назва категорії (Українська)</label>
          <input
            className={styles.input}
            name="nameUk"
            defaultValue={category?.nameUk ?? ""}
            placeholder="напр. Принти та мистецтво"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Slug (URL-посилання) *</label>
          <input
            className={styles.input}
            name="slug"
            defaultValue={category?.slug ?? ""}
            placeholder="напр. apparel"
            required
            onInput={(e) => {
              (e.target as HTMLInputElement).dataset.edited = "1";
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <Link href="/admin/categories" className={styles.cancelBtn}>
            Скасувати
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={pending}>
            {category ? <Save size={16} /> : <Plus size={16} />}
            <span>{pending ? (isEdit ? "Збереження..." : "Створення...") : (isEdit ? "Зберегти зміни" : "Створити")}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
