"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../admin.module.scss";
import { logoutAction } from "../_action";

const navSections = [
  {
    title: "Основні",
    items: [
      { label: "Картини", href: "/admin/paintings" },
      { label: "Пости", href: "/admin/posts" },
      { label: "Товари", href: "/admin/products" },
      { label: "Автори", href: "/admin/authors" },
    ],
  },
  {
    title: "Допоміжні",
    items: [
      { label: "Категорії", href: "/admin/categories" },
      { label: "Колекції", href: "/admin/collections" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link
        href="/admin"
        className={`${styles.navLink} ${pathname === "/admin" ? styles.active : ""}`}
      >
        Дашборд
      </Link>

      {navSections.map((section) => (
        <div key={section.title}>
          <p className={styles.sidebarTitle}>{section.title}</p>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname.startsWith(item.href) ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className={styles.sidebarFooter}>
        <Link href="/" className={styles.navLink}>
          ← На сайт
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.navLink}>
            Вийти
          </button>
        </form>
      </div>
    </aside>
  );
}
