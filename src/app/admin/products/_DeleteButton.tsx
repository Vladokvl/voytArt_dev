"use client";
import styles from "../admin-table.module.scss";
import { deleteProductAction } from "./_actions";

export default function DeleteProductButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProductAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Видалити товар?")) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.buttonOutline}>
        Вид.
      </button>
    </form>
  );
}
