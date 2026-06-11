"use client";
import styles from "../admin-table.module.scss";
import { deletePostAction } from "./_actions";

export default function DeletePostButton({ id }: { id: number }) {
  return (
    <form
      action={deletePostAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити пост?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.buttonOutline}>
        Вид.
      </button>
    </form>
  );
}
