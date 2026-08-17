import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import Link from "next/link";
import { Plus, Edit2, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import DeleteAuthorButton from "./_DeleteButton";
import { swapAuthorOrderAction, moveAuthorToPositionAction } from "./_actions";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import SortableHeader from "../_components/SortableHeader";

type AuthorSortField = "name" | "paintingsCount" | "status" | "order";

type SearchParams = Promise<{
  sortBy?: AuthorSortField;
  sortDir?: "asc" | "desc";
}>;

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "order", sortDir = "asc" } = await searchParams;
  const validSortDir: "asc" | "desc" = sortDir === "desc" ? "desc" : "asc";

  let orderByQuery: Record<string, any> = { order: validSortDir };
  if (sortBy === "name") {
    orderByQuery = { firstName: validSortDir };
  } else if (sortBy === "paintingsCount") {
    orderByQuery = { paintings: { _count: validSortDir } };
  } else if (sortBy === "status") {
    orderByQuery = { active: validSortDir };
  } else if (sortBy === "order") {
    orderByQuery = { order: validSortDir };
  }

  const authors = await db.author.findMany({
    include: { _count: { select: { paintings: true, products: true } } },
    orderBy: orderByQuery,
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
              <th className={`${styles.th} ${styles.thThumb}`}>Фото</th>
              <SortableHeader field="name" label="Імʼя та прізвище" defaultField="order" />
              <SortableHeader field="paintingsCount" label="Картин" defaultField="order" />
              <SortableHeader field="status" label="Статус" defaultField="order" />
              <SortableHeader field="order" label="Порядок" defaultField="order" />
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
                  <td className={styles.tdThumb}>
                    {a.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getOptimizedImageUrl(a.photoUrl, { preset: "thumb" })} alt={a.firstName} className={styles.thumbnail} />
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
