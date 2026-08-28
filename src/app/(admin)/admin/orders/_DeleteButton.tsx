"use client";

import { Trash2 } from "lucide-react";
import styles from "../admin-table.module.scss";
import { deleteOrderAction } from "./_actions";

export default function DeleteOrderButton({ id }: { id: number }) {
  return (
    <form
      action={deleteOrderAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити це замовлення з бази даних?")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={styles.iconBtnDanger} title="Видалити замовлення">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
