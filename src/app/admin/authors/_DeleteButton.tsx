"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deleteAuthorAction } from "./_actions";

export default function DeleteAuthorButton({ id }: { id: number }) {
  return (
    <form
      action={deleteAuthorAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цього автора? Усі повʼязані картини також будуть видалені.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити автора">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
