import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import DeleteProductButton from "./_DeleteButton";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      author: true,
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Товари (Мерч)</h1>
        </div>
        <Link href="/admin/products/new" className={styles.button}>
          <Plus size={16} />
          <span>Додати товар</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 64 }}>Фото</th>
              <th className={styles.th}>Назва товару</th>
              <th className={styles.th}>Автор</th>
              <th className={styles.th}>Категорія</th>
              <th className={styles.th}>Ціна</th>
              <th className={styles.th}>Залишок</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  Товарів у магазині ще немає
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className={styles.td}>
                    {p.coverUrl ?? p.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverUrl ?? p.images[0]?.url}
                        alt={p.title}
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
                  <td className={styles.td} style={{ fontWeight: 600 }}>{p.title}</td>
                  <td className={styles.td}>
                    {p.author.firstName} {p.author.lastName}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                      {p.category.name}
                    </span>
                  </td>
                  <td className={styles.td} style={{ fontWeight: 700, color: "#0f172a" }}>
                    {p.price.toLocaleString("uk-UA")} €
                  </td>
                  <td className={styles.td}>
                    {p.stock > 0 ? (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        ● {p.stock} шт
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeDanger}`}>
                        ✕ 0 шт
                      </span>
                    )}
                  </td>
                  <td className={styles.td}>
                    {p.isActive ? (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        ● Активний
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeNeutral}`} style={{ opacity: 0.7 }}>
                        ○ Приховано
                      </span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className={styles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeleteProductButton id={p.id} />
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
