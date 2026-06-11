import { db } from '~/lib/db'
import styles from '../admin-table.module.scss'
import Link from 'next/link'
import DeleteCategoryButton from './_DeleteButton'

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Категорії</h1>
        <Link href="/admin/categories/new" className={styles.button}>+ Додати категорію</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Назва</th>
            <th className={styles.th}>Slug</th>
            <th className={styles.th}>Товарів</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.empty}>Категорій ще немає</td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c.id}>
                <td className={styles.td}>{c.name}</td>
                <td className={styles.td}>{c.slug}</td>
                <td className={styles.td}>{c._count.products}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Link href={`/admin/categories/edit/${c.id}`} className={styles.buttonOutline}>Ред.</Link>
                    <DeleteCategoryButton id={c.id} />
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
