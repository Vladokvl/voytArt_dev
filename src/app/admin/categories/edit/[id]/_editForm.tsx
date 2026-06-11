"use client";
import { useActionState, useTransition } from "react";
import { updateCategoryAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";

type Category = { id: number; name: string; slug: string };

export default function CategoryEditForm({ category }: { category: Category }) {
  const [state, formAction] = useActionState(updateCategoryAction, undefined);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => formAction(fd))}
      className={styles.form}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Редагувати категорію</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={category.id} />

      <div className={styles.field}>
        <label className={styles.label}>Назва *</label>
        <input className={styles.input} name="name" defaultValue={category.name} required />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Slug *</label>
        <input className={styles.input} name="slug" defaultValue={category.slug} required />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={pending}>
        {pending ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  );
}
