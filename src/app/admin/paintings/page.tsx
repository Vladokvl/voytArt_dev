import { db } from "~/lib/db";
import tableStyles from "../admin-table.module.scss";
import paintingStyles from "./paintings.module.scss";
import Link from "next/link";
import {
  deletePaintingAction,
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
      <div className={tableStyles.header}>
        <h1 className={tableStyles.heading}>Картини</h1>
        <Link href="/admin/paintings/new" className={tableStyles.button}>
          + Додати картину
        </Link>
      </div>

      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>Порядковий номер</th>
            <th className={tableStyles.th}>Фото</th>
            <th className={tableStyles.th}>Назва</th>
            <th className={tableStyles.th}>Опис</th>
            <th className={tableStyles.th}>Автор</th>
            <th className={tableStyles.th}>Колекція</th>
            <th className={tableStyles.th}>Рік</th>
            <th className={tableStyles.th}>Для продажу?</th>
            <th className={tableStyles.th}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {paintings.length === 0 ? (
            <tr>
              <td colSpan={9} className={tableStyles.empty}>
                Картин ще немає
              </td>
            </tr>
          ) : (
            paintings.map((p, i) => (
              <tr key={p.id}>
                <td className={tableStyles.td}>
                  <form
                    action={async (fd) => {
                      "use server";
                      const pos = Number(fd.get("pos")) - 1;
                      await movePaintingToPositionAction(p.id, pos);
                    }}
                  >
                    <input
                      name="pos"
                      type="number"
                      min={0}
                      max={paintings.length}
                      defaultValue={i + 1}
                      style={{ width: 50 }}
                    />
                    <button type="submit">→</button>
                  </form>
                </td>
                <td className={tableStyles.td}>
                  {p.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverUrl}
                      alt={p.title}
                      className={tableStyles.thumbnail}
                    />
                  )}
                </td>
                <td className={tableStyles.td}>{p.title}</td>
                <td className={`${tableStyles.td} ${paintingStyles.descriptionCell}`}>
                  <div
                    className={paintingStyles.descPreview}
                    dangerouslySetInnerHTML={{ __html: p.description ?? "" }}
                  />
                </td>
                <td className={tableStyles.td}>
                  {p.author.firstName} {p.author.lastName}
                </td>
                <td className={tableStyles.td}>{p.collection?.title ?? "—"}</td>
                <td className={tableStyles.td}>{p.year}</td>
                <td className={tableStyles.td}>
                  {p.isForSale ? "для продажу" : "не для продажу"}
                </td>
                <td className={tableStyles.td}>
                  <div className={tableStyles.actions}>
                    <Link
                      href={`/admin/paintings/edit/${p.id}`}
                      className={tableStyles.buttonOutline}
                    >
                      Редагувати
                    </Link>
                    <form action={deletePaintingAction.bind(null, p.id)}>
                      <button type="submit" className={tableStyles.buttonOutline}>
                        Видалити
                      </button>
                    </form>
                    <form
                      action={swapPaintingOrderAction.bind(
                        null,
                        p.id,
                        paintings[i - 1]?.id ?? p.id,
                      )}
                    >
                      <button type="submit" disabled={i === 0}>
                        ↑
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
                        disabled={i === paintings.length - 1}
                      >
                        ↓
                      </button>
                    </form>
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
