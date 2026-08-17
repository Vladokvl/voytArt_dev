import { db } from "~/lib/db";
import Link from "next/link";
import styles from "../admin-table.module.scss";
import { Plus, Edit2 } from "lucide-react";
import DeleteCollectionButton from "./_DeleteButton";

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    include: {
      author: true,
      _count: { select: { paintings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Колекції робіт</h1>
        </div>
        <Link href="/admin/collections/new" className={styles.button}>
          <Plus size={16} />
          <span>Додати колекцію</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 64 }}>Обкладинка</th>
              <th className={styles.th}>Назва колекції</th>
              <th className={styles.th}>Автор</th>
              <th className={styles.th}>Кількість картин</th>
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Колекцій ще немає
                </td>
              </tr>
            ) : (
              collections.map((col) => (
                <tr key={col.id}>
                  <td className={styles.td}>
                    {col.coverPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={col.coverPhotoUrl}
                        alt={col.title}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <div
                        className={styles.thumbnail}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem" }}
                      >
                        —
                      </div>
                    )}
                  </td>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{col.title}</td>
                  <td className={styles.td}>
                    {col.author.firstName} {col.author.lastName}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                      {col._count.paintings} картин
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/collections/edit/${col.id}`}
                        className={styles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeleteCollectionButton id={col.id} />
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
