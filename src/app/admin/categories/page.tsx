import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import DeleteCategoryButton from "./_DeleteButton";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
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
              <th className={styles.th}>Назва категорії</th>
              <th className={styles.th}>Slug (URL)</th>
              <th className={styles.th}>Кількість товарів</th>
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
