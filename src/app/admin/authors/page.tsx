import { db } from '~/lib/db'
import styles from '../admin-table.module.scss'
import Link from 'next/link'
import DeleteAuthorButton from './_DeleteButton'
import { swapAuthorOrderAction, moveAuthorToPositionAction } from './_actions'

export default async function AuthorsPage() {
  const authors = await db.author.findMany({
    include: { _count: { select: { paintings: true } } },
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Автори</h1>
        <Link href="/admin/authors/new" className={styles.button}>+ Додати автора</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Фото</th>
            <th className={styles.th}>Імʼя</th>
            <th className={styles.th}>Картин</th>
            <th className={styles.th}>Порядок</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>Авторів ще немає</td>
            </tr>
          ) : (
            authors.map((a, index) => (
              <tr key={a.id}>
                <td className={styles.td}>
                  {a.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photoUrl} alt={a.firstName} className={styles.thumbnail} />
                  )}
                </td>
                <td className={styles.td}>{a.firstName} {a.lastName}</td>
                <td className={styles.td}>{a._count.paintings}</td>
                <td className={styles.td}>
                  <form
                    action={async (fd) => {
                      "use server";
                      const pos = Number(fd.get("pos")) - 1;
                      await moveAuthorToPositionAction(a.id, pos);
                    }}
                    style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
                  >
                    <input
                      name="pos"
                      type="number"
                      min={1}
                      max={authors.length}
                      defaultValue={index + 1}
                      style={{ width: 50, padding: "0.15rem 0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button type="submit" className={styles.buttonOutline} style={{ padding: "0.15rem 0.35rem", cursor: "pointer" }}>→</button>
                  </form>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <form
                      action={swapAuthorOrderAction.bind(
                        null,
                        a.id,
                        authors[index - 1]?.id ?? a.id,
                      )}
                    >
                      <button type="submit" className={styles.buttonOutline} disabled={index === 0} style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}>
                        ↑
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
                        className={styles.buttonOutline}
                        disabled={index === authors.length - 1}
                        style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                      >
                        ↓
                      </button>
                    </form>
                    <Link href={`/admin/authors/edit/${a.id}`} className={styles.buttonOutline}>Ред.</Link>
                    <DeleteAuthorButton id={a.id} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
