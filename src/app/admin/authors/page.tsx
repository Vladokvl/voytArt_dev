import { db } from '~/lib/db'
import styles from '../admin-table.module.scss'
import Link from 'next/link'
import DeleteAuthorButton from './_DeleteButton'

export default async function AuthorsPage() {
  const authors = await db.author.findMany({
    include: { _count: { select: { paintings: true } } },
    orderBy: { createdAt: 'desc' },
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
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.empty}>Авторів ще немає</td>
            </tr>
          ) : (
            authors.map((a) => (
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
                  <div className={styles.actions}>
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
