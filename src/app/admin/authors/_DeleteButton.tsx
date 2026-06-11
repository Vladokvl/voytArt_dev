"use client";
import styles from "../admin-table.module.scss";
import { deleteAuthorAction } from "./_actions";

export default function DeleteAuthorButton({ id }: { id: number }) {
  return (
    <form
      action={deleteAuthorAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити автора?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.buttonOutline}>
        Вид.
      </button>
    </form>
  );
}
