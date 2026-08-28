"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deleteProductAction } from "./_actions";

export default function DeleteProductButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProductAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цей товар?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити товар">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
