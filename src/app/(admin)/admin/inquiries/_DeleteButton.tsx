"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteInquiryAction } from "./_actions";
import styles from "../admin-table.module.scss";

export default function DeleteInquiryButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Ви дійсно бажаєте видалити цей запит на картину?")) {
      startTransition(async () => {
        await deleteInquiryAction(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteBtn}
      title="Видалити запит"
      type="button"
    >
      <Trash2 size={16} />
    </button>
  );
}
