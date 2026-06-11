import { db } from '~/lib/db'
import styles from './dashboard.module.scss'

export default async function AdminDashboard() {
  const [paintingsCount, authorsCount, productsCount, postsCount] =
    await Promise.all([
      db.painting.count(),
      db.author.count(),
      db.product.count(),
      db.galleryPost.count(),
    ])

  const stats = [
    { label: 'Картини', count: paintingsCount, href: '/admin/paintings' },
    { label: 'Автори', count: authorsCount, href: '/admin/authors' },
    { label: 'Товари', count: productsCount, href: '/admin/products' },
    { label: 'Пости', count: postsCount, href: '/admin/posts' },
  ]

  return (
    <div>
      <h1 className={styles.heading}>Дашборд</h1>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <a key={stat.href} href={stat.href} className={styles.card}>
            <span className={styles.count}>{stat.count}</span>
            <span className={styles.label}>{stat.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
