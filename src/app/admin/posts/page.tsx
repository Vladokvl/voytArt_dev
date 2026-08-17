import { db, type Prisma } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2, Calendar } from "lucide-react";
import DeletePostButton from "./_DeleteButton";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import SortableHeader from "../_components/SortableHeader";

type PostSortField = "title" | "date" | "createdAt";

type SearchParams = Promise<{
  sortBy?: PostSortField;
  sortDir?: "asc" | "desc";
}>;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "createdAt", sortDir = "desc" } = await searchParams;
  const validSortDir: "asc" | "desc" = sortDir === "asc" ? "asc" : "desc";

  let orderByQuery: Prisma.GalleryPostOrderByWithRelationInput = { createdAt: validSortDir };
  if (sortBy === "title") {
    orderByQuery = { title: validSortDir };
  } else if (sortBy === "date") {
    orderByQuery = { date: validSortDir };
  } else if (sortBy === "createdAt") {
    orderByQuery = { createdAt: validSortDir };
  }

  const posts = await db.galleryPost.findMany({
    orderBy: orderByQuery,
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
              <th className={`${styles.th} ${styles.thThumb}`}>Обкладинка</th>
              <SortableHeader field="title" label="Заголовок посту" defaultField="createdAt" />
              <SortableHeader field="date" label="Дата публікації" defaultField="createdAt" />
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
                  <td className={styles.tdThumb}>
                    {p.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getOptimizedImageUrl(p.coverUrl, { preset: "thumb" })} alt={p.title} className={styles.thumbnail} />
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
