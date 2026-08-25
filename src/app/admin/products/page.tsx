import { db, type Prisma } from "~/lib/db";
import { decimalToNumber } from "~/lib/plain-product";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import DeleteProductButton from "./_DeleteButton";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import SortableHeader from "../_components/SortableHeader";
import Pagination from "../_components/Pagination";
import { swapProductOrderAction, moveProductToPositionAction } from "./_actions";

type ProductSortField = "title" | "author" | "category" | "price" | "stock" | "status" | "sortOrder";

type SearchParams = Promise<{
  sortBy?: ProductSortField;
  sortDir?: "asc" | "desc";
  page?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "sortOrder", sortDir = "asc" } = await searchParams;
  const validSortDir: "asc" | "desc" = sortDir === "desc" ? "desc" : "asc";

  let orderByQuery: Prisma.ProductOrderByWithRelationInput = { sortOrder: validSortDir };
  if (sortBy === "title") {
    orderByQuery = { title: validSortDir };
  } else if (sortBy === "author") {
    orderByQuery = { author: { firstName: validSortDir } };
  } else if (sortBy === "category") {
    orderByQuery = { category: { name: validSortDir } };
  } else if (sortBy === "price") {
    orderByQuery = { price: validSortDir };
  } else if (sortBy === "stock") {
    orderByQuery = { stock: validSortDir };
  } else if (sortBy === "status") {
    orderByQuery = { isActive: validSortDir };
  } else if (sortBy === "sortOrder") {
    orderByQuery = { sortOrder: validSortDir };
  }

  const page = Number(await searchParams.then(s => s.page)) || 1;
  const pageSize = 20;

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      include: {
        category: true,
        author: true,
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: orderByQuery,
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    db.product.count(),
  ]);

  const plainProducts = products.map((p) => ({ ...p, price: decimalToNumber(p.price) }));

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
              <th className={`${styles.th} ${styles.thThumb}`}>Фото</th>
              <SortableHeader field="title" label="Назва товару" defaultField="sortOrder" />
              <SortableHeader field="author" label="Автор" defaultField="sortOrder" />
              <SortableHeader field="category" label="Категорія" defaultField="sortOrder" />
              <SortableHeader field="price" label="Ціна" defaultField="sortOrder" />
              <SortableHeader field="stock" label="Залишок" defaultField="sortOrder" />
              <SortableHeader field="status" label="Статус" defaultField="sortOrder" />
              <SortableHeader field="sortOrder" label="Порядок" defaultField="sortOrder" />
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {plainProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  Товарів у магазині ще немає
                </td>
              </tr>
            ) : (
              plainProducts.map((p, i) => (
                <tr key={p.id}>
                  <td className={styles.tdThumb}>
                    {p.coverUrl ?? p.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getOptimizedImageUrl(p.coverUrl ?? p.images[0]?.url, { preset: "thumb" })}
                        alt={p.title}
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
                    <form
                      action={async (fd) => {
                        "use server";
                        const pos = Number(fd.get("pos")) - 1;
                        await moveProductToPositionAction(p.id, pos);
                      }}
                      className={styles.orderForm}
                    >
                      <input
                        name="pos"
                        type="number"
                        min={1}
                        max={products.length}
                        defaultValue={i + 1}
                        className={styles.orderInput}
                      />
                      <button type="submit" className={styles.iconBtn} title="Перемістити">
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <form
                        action={swapProductOrderAction.bind(
                          null,
                          p.id,
                          products[i - 1]?.id ?? p.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={styles.iconBtn}
                          disabled={i === 0}
                          title="Підняти вище"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </form>
                      <form
                        action={swapProductOrderAction.bind(
                          null,
                          p.id,
                          products[i + 1]?.id ?? p.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={styles.iconBtn}
                          disabled={i === products.length - 1}
                          title="Опустити нижче"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </form>
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

        <Pagination totalItems={totalCount} pageSize={pageSize} />
      </div>
    </div>
  );
}
