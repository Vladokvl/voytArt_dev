"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deleteCategoryAction } from "./_actions";

export default function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <form
      action={deleteCategoryAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цю категорію? Товари в ній втратять категорію.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити категорію">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
