import { db } from '~/lib/db'
import styles from '../admin-table.module.scss'
import Link from 'next/link'
import DeleteProductButton from './_DeleteButton'

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: { category: true, author: true, images: { orderBy: { order: 'asc' }, take: 1 } },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Товари</h1>
        <Link href="/admin/products/new" className={styles.button}>+ Додати товар</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Фото</th>
            <th className={styles.th}>Назва</th>
            <th className={styles.th}>Автор</th>
            <th className={styles.th}>Категорія</th>
            <th className={styles.th}>Ціна</th>
            <th className={styles.th}>Залишок</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>Товарів ще немає</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td className={styles.td}>
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.title} className={styles.thumbnail} />
                  )}
                </td>
                <td className={styles.td}>{p.title}</td>
                <td className={styles.td}>{p.author.firstName} {p.author.lastName}</td>
                <td className={styles.td}>{p.category.name}</td>
                <td className={styles.td}>{p.price} грн</td>
                <td className={styles.td}>{p.stock}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Link href={`/admin/products/edit/${p.id}`} className={styles.buttonOutline}>Ред.</Link>
                    <DeleteProductButton id={p.id} />
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
