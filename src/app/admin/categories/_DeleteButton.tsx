"use client";
import styles from "../admin-table.module.scss";
import { deleteCategoryAction } from "./_actions";

export default function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <form
      action={deleteCategoryAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити категорію?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.buttonOutline}>
        Вид.
      </button>
    </form>
  );
}
