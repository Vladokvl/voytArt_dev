import { db } from "~/lib/db";
import Link from "next/link";
import styles from "../admin-table.module.scss";
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
      <div className={styles.header}>
        <h1 className={styles.heading}>Колекції</h1>
        <Link href="/admin/collections/new" className={styles.button}>
          + Додати колекцію
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Обкладинка</th>
            <th className={styles.th}>Назва</th>
            <th className={styles.th}>Автор</th>
            <th className={styles.th}>Картин</th>
            <th className={styles.th}></th>
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
                  {col.coverPhotoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={col.coverPhotoUrl}
                      alt={col.title}
                      className={styles.thumbnail}
                    />
                  )}
                </td>
                <td className={styles.td}>{col.title}</td>
                <td className={styles.td}>
                  {col.author.firstName} {col.author.lastName}
                </td>
                <td className={styles.td}>{col._count.paintings}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/collections/edit/${col.id}`}
                      className={styles.buttonOutline}
                    >
                      Ред.
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
  );
}
