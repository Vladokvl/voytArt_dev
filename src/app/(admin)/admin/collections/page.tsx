import { db, type Prisma } from "~/lib/db";
import Link from "next/link";
import styles from "../admin-table.module.scss";
import { Plus, Edit2 } from "lucide-react";
import DeleteCollectionButton from "./_DeleteButton";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import SortableHeader from "../_components/SortableHeader";
import Pagination from "../_components/Pagination";

type CollectionSortField = "title" | "author" | "paintingsCount" | "createdAt";

type SearchParams = Promise<{
  sortBy?: CollectionSortField;
  sortDir?: "asc" | "desc";
  page?: string;
}>;

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "createdAt", sortDir = "desc", page: pageParam } = await searchParams;
  const validSortDir: "asc" | "desc" = sortDir === "asc" ? "asc" : "desc";

  let orderByQuery: Prisma.CollectionOrderByWithRelationInput = { createdAt: validSortDir };
  if (sortBy === "title") {
    orderByQuery = { title: validSortDir };
  } else if (sortBy === "author") {
    orderByQuery = { author: { firstName: validSortDir } };
  } else if (sortBy === "paintingsCount") {
    orderByQuery = { paintings: { _count: validSortDir } };
  } else if (sortBy === "createdAt") {
    orderByQuery = { createdAt: validSortDir };
  }

  const page = Number(pageParam) || 1;
  const pageSize = 20;

  const [collections, totalCount] = await Promise.all([
    db.collection.findMany({
      include: {
        author: true,
        _count: { select: { paintings: true } },
      },
      orderBy: orderByQuery,
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    db.collection.count(),
  ]);

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
              <th className={`${styles.th} ${styles.thThumb}`}>Обкладинка</th>
              <SortableHeader field="title" label="Назва колекції" defaultField="createdAt" />
              <SortableHeader field="author" label="Автор" defaultField="createdAt" />
              <SortableHeader field="paintingsCount" label="Кількість картин" defaultField="createdAt" />
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
                  <td className={styles.tdThumb}>
                    {col.coverPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getOptimizedImageUrl(col.coverPhotoUrl, { preset: "thumb" })}
                        alt={col.title}
                        loading="lazy"
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

        <Pagination totalItems={totalCount} pageSize={pageSize} />
      </div>
    </div>
  );
}
