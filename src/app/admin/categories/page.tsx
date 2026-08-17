import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import DeleteCategoryButton from "./_DeleteButton";
import SortableHeader from "../_components/SortableHeader";

type CategorySortField = "name" | "slug" | "productsCount";

type SearchParams = Promise<{
  sortBy?: CategorySortField;
  sortDir?: "asc" | "desc";
}>;

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "name", sortDir = "asc" } = await searchParams;
  const validSortDir: "asc" | "desc" = sortDir === "desc" ? "desc" : "asc";

  let orderByQuery: Record<string, any> = { name: validSortDir };
  if (sortBy === "name") {
    orderByQuery = { name: validSortDir };
  } else if (sortBy === "slug") {
    orderByQuery = { slug: validSortDir };
  } else if (sortBy === "productsCount") {
    orderByQuery = { products: { _count: validSortDir } };
  }

  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: orderByQuery,
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Категорії товарів</h1>
        </div>
        <Link href="/admin/categories/new" className={styles.button}>
          <Plus size={16} />
          <span>Додати категорію</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <SortableHeader field="name" label="Назва категорії" defaultField="name" />
              <SortableHeader field="slug" label="Slug (URL)" defaultField="name" />
              <SortableHeader field="productsCount" label="Кількість товарів" defaultField="name" />
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  Категорій ще немає
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{c.name}</td>
                  <td className={styles.td}>
                    <code style={{ background: "#f1f5f9", padding: "0.15rem 0.45rem", borderRadius: "4px", fontSize: "0.8rem", color: "#475569" }}>
                      {c.slug}
                    </code>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                      {c._count.products} товарів
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/categories/edit/${c.id}`}
                        className={styles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeleteCategoryButton id={c.id} />
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
