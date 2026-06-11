import { db } from '~/lib/db'
import styles from '../admin-table.module.scss'
import Link from 'next/link'
import DeletePostButton from './_DeleteButton'

export default async function PostsPage() {
  const posts = await db.galleryPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Пости</h1>
        <Link href="/admin/posts/new" className={styles.button}>+ Додати пост</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Заголовок</th>
            <th className={styles.th}>Дата</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={3} className={styles.empty}>Постів ще немає</td>
            </tr>
          ) : (
            posts.map((p) => (
              <tr key={p.id}>
                <td className={styles.td}>{p.title}</td>
                <td className={styles.td}>
                  {p.date
                    ? p.date.toLocaleDateString('uk-UA')
                    : <span style={{ color: '#999' }}>Без дати</span>
                  }
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Link href={`/admin/posts/edit/${p.id}`} className={styles.buttonOutline}>Ред.</Link>
                    <DeletePostButton id={p.id} />
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
