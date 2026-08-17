"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deleteCollectionAction } from "./_actions";

export default function DeleteCollectionButton({ id }: { id: number }) {
  return (
    <form
      action={deleteCollectionAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цю колекцію?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити колекцію">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
