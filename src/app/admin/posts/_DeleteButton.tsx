"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deletePostAction } from "./_actions";

export default function DeletePostButton({ id }: { id: number }) {
  return (
    <form
      action={deletePostAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цей пост?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити пост">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
