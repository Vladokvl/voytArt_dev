"use client";
import styles from "../admin-table.module.scss";
import { deleteCollectionAction } from "./_actions";

export default function DeleteCollectionButton({ id }: { id: number }) {
  return (
    <form
      action={deleteCollectionAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити колекцію?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.buttonOutline}>
        Вид.
      </button>
    </form>
  );
}
