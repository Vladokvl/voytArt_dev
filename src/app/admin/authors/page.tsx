import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import DeleteAuthorButton from "./_DeleteButton";
import { swapAuthorOrderAction, moveAuthorToPositionAction } from "./_actions";

export default async function AuthorsPage() {
  const authors = await db.author.findMany({
    include: { _count: { select: { paintings: true, products: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      {/* Table Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Автори</h1>
        </div>
        <Link href="/admin/authors/new" className={styles.button}>
          <Plus size={16} />
          <span>Додати автора</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 64 }}>Фото</th>
              <th className={styles.th}>Імʼя та прізвище</th>
              <th className={styles.th}>Картин</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th}>Порядок</th>
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Авторів ще не створено
                </td>
              </tr>
            ) : (
              authors.map((a, index) => (
                <tr key={a.id}>
                  <td className={styles.td}>
                    {a.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.photoUrl} alt={a.firstName} className={styles.thumbnail} />
                    ) : (
                      <div className={styles.thumbnail} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem" }}>
                        —
                      </div>
                    )}
                  </td>
                  <td className={styles.td} style={{ fontWeight: 600 }}>
                    {a.firstName} {a.lastName}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                      {a._count.paintings} робіт
                    </span>
                  </td>
                  <td className={styles.td}>
                    {a.active ? (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        ● Активний
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        ○ Прихований
                      </span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <form
                      action={async (fd) => {
                        "use server";
                        const pos = Number(fd.get("pos")) - 1;
                        await moveAuthorToPositionAction(a.id, pos);
                      }}
                      className={styles.orderForm}
                    >
                      <input
                        name="pos"
                        type="number"
                        min={1}
                        max={authors.length}
                        defaultValue={index + 1}
                        className={styles.orderInput}
                      />
                      <button type="submit" className={styles.iconBtn} title="Перемістити на позицію">
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <form
                        action={swapAuthorOrderAction.bind(
                          null,
                          a.id,
                          authors[index - 1]?.id ?? a.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={styles.iconBtn}
                          disabled={index === 0}
                          title="Підняти вище"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </form>
                      <form
                        action={swapAuthorOrderAction.bind(
                          null,
                          a.id,
                          authors[index + 1]?.id ?? a.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={styles.iconBtn}
                          disabled={index === authors.length - 1}
                          title="Опустити нижче"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </form>
                      <Link
                        href={`/admin/authors/edit/${a.id}`}
                        className={styles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeleteAuthorButton id={a.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
