import { db } from "~/lib/db";
import tableStyles from "../admin-table.module.scss";
import Link from "next/link";
import {
  Plus,
  Edit2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Zap,
} from "lucide-react";
import DeletePaintingButton from "./_DeleteButton";
import {
  movePaintingToPositionAction,
  swapPaintingOrderAction,
} from "./_actions";

export default async function PaintingsPage() {
  const paintings = await db.painting.findMany({
    include: { author: true, collection: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      {/* Header */}
      <div className={tableStyles.header}>
        <div>
          <h1 className={tableStyles.heading}>Картини</h1>
        </div>
        <Link href="/admin/paintings/new" className={tableStyles.button}>
          <Plus size={16} />
          <span>Додати картину</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={tableStyles.tableCard}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th} style={{ width: 64 }}>Фото</th>
              <th className={tableStyles.th}>Назва</th>
              <th className={tableStyles.th}>Автор</th>
              <th className={tableStyles.th}>Колекція</th>
              <th className={tableStyles.th}>Рік</th>
              <th className={tableStyles.th}>Статус продажу</th>
              <th className={tableStyles.th}>Порядок</th>
              <th className={tableStyles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {paintings.length === 0 ? (
              <tr>
                <td colSpan={8} className={tableStyles.empty}>
                  Картин ще не додано
                </td>
              </tr>
            ) : (
              paintings.map((p, i) => (
                <tr key={p.id}>
                  <td className={tableStyles.td}>
                    {p.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverUrl}
                        alt={p.title}
                        className={tableStyles.thumbnail}
                      />
                    ) : (
                      <div
                        className={tableStyles.thumbnail}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem" }}
                      >
                        —
                      </div>
                    )}
                  </td>
                  <td className={tableStyles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>{p.title}</span>
                      {p.hasNeon && (
                        <span className={`${tableStyles.badge} ${tableStyles.badgeNeon}`} title="Має неоновий шар">
                          <Zap size={11} />
                          <span>Neon</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={tableStyles.td}>
                    {p.author.firstName} {p.author.lastName}
                  </td>
                  <td className={tableStyles.td}>
                    {p.collection ? (
                      <span className={`${tableStyles.badge} ${tableStyles.badgeNeutral}`}>
                        {p.collection.title}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                  <td className={tableStyles.td}>{p.year ?? "—"}</td>
                  <td className={tableStyles.td}>
                    {p.isForSale ? (
                      <span className={`${tableStyles.badge} ${tableStyles.badgeSuccess}`}>
                        ● Для продажу
                      </span>
                    ) : (
                      <span className={`${tableStyles.badge} ${tableStyles.badgeNeutral}`}>
                        ○ Виставка
                      </span>
                    )}
                  </td>
                  <td className={tableStyles.td}>
                    <form
                      action={async (fd) => {
                        "use server";
                        const pos = Number(fd.get("pos")) - 1;
                        await movePaintingToPositionAction(p.id, pos);
                      }}
                      className={tableStyles.orderForm}
                    >
                      <input
                        name="pos"
                        type="number"
                        min={1}
                        max={paintings.length}
                        defaultValue={i + 1}
                        className={tableStyles.orderInput}
                      />
                      <button type="submit" className={tableStyles.iconBtn} title="Перемістити">
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  </td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.actions} style={{ justifyContent: "flex-end" }}>
                      <form
                        action={swapPaintingOrderAction.bind(
                          null,
                          p.id,
                          paintings[i - 1]?.id ?? p.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={tableStyles.iconBtn}
                          disabled={i === 0}
                          title="Підняти вище"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </form>
                      <form
                        action={swapPaintingOrderAction.bind(
                          null,
                          p.id,
                          paintings[i + 1]?.id ?? p.id,
                        )}
                      >
                        <button
                          type="submit"
                          className={tableStyles.iconBtn}
                          disabled={i === paintings.length - 1}
                          title="Опустити нижче"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </form>
                      <Link
                        href={`/admin/paintings/edit/${p.id}`}
                        className={tableStyles.iconBtn}
                        title="Редагувати"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeletePaintingButton id={p.id} />
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
