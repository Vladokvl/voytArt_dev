"use client";
import { useActionState } from "react";
import { loginAction } from "./_actions";
import styles from "./login.module.scss";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h1 className={styles.title}>Admin Panel</h1>
        <form action={formAction}>
          {state?.error && <p className={styles.error}>{state.error}</p>}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? "Вхід..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}
