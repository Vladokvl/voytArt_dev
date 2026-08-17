"use client";

import { Trash2 } from "lucide-react";
import tableStyles from "../admin-table.module.scss";
import { deletePaintingAction } from "./_actions";

export default function DeletePaintingButton({ id }: { id: number }) {
  return (
    <form
      action={deletePaintingAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити цю картину? Усі повʼязані медіа-файли також будуть видалені.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={tableStyles.iconBtnDanger}
        title="Видалити картину"
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
