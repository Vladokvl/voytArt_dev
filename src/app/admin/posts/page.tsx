import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2, Calendar } from "lucide-react";
import DeletePostButton from "./_DeleteButton";

export default async function PostsPage() {
  const posts = await db.galleryPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Пости галереї</h1>
        </div>
        <Link href="/admin/posts/new" className={styles.button}>
          <Plus size={16} />
          <span>Додати пост</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 64 }}>Обкладинка</th>
              <th className={styles.th}>Заголовок посту</th>
              <th className={styles.th}>Дата публікації</th>
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  Постів у блозі ще немає
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id}>
                  <td className={styles.td}>
                    {p.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverUrl} alt={p.title} className={styles.thumbnail} />
                    ) : (
                      <div
                        className={styles.thumbnail}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem" }}
                      >
                        —
                      </div>
                    )}
                  </td>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{p.title}</td>
                  <td className={styles.td}>
                    {p.date ? (
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        <Calendar size={12} />
                        <span>{p.date.toLocaleDateString("uk-UA")}</span>
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>Без дати</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/posts/edit/${p.id}`}
                        className={styles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeletePostButton id={p.id} />
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
