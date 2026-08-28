"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { updateCategoryAction } from "../../_actions";
import styles from "@/app/(admin)/admin/_formStyles.module.scss";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";

type Category = { id: number; name: string; nameUk?: string | null; slug: string };

export default function CategoryEditForm({ category }: { category: Category }) {
  useSetBreadcrumb(category.name);
  const [state, formAction] = useActionState(updateCategoryAction, undefined);
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
            <h1 className={styles.headerTitle}>Редагування категорії: {category.name}</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              ID: #{category.id}
            </p>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={pending}>
          <Save size={16} />
          <span>{pending ? "Збереження..." : "Зберегти"}</span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={category.id} />

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
            defaultValue={category.name}
            placeholder="e.g. Prints & Art"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Назва категорії (Українська)</label>
          <input
            className={styles.input}
            name="nameUk"
            defaultValue={category.nameUk ?? ""}
            placeholder="напр. Принти та мистецтво"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Slug (URL-посилання) *</label>
          <input
            className={styles.input}
            name="slug"
            defaultValue={category.slug}
            placeholder="напр. apparel"
            required
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <Link href="/admin/categories" className={styles.cancelBtn}>
            Скасувати
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={pending}>
            <Save size={16} />
            <span>{pending ? "Збереження..." : "Зберегти зміни"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
