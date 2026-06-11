"use client";
import { useActionState, useTransition } from "react";
import { createCategoryAction } from "../_actions";
import styles from "../../_formStyles.module.scss";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, undefined);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => formAction(fd))}
      className={styles.form}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Нова категорія</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Назва *</label>
        <input
          className={styles.input}
          name="name"
          placeholder="Назва категорії"
          required
          onChange={(e) => {
            const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
            if (slugInput && !slugInput.dataset.edited) {
              slugInput.value = toSlug(e.target.value);
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Slug *</label>
        <input
          className={styles.input}
          name="slug"
          placeholder="slug-kategorii"
          required
          onInput={(e) => { (e.target as HTMLInputElement).dataset.edited = "1"; }}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={pending}>
        {pending ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
