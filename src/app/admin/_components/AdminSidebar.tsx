"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Users,
  ShoppingBag,
  FileText,
  FolderTree,
  Sparkles,
  ExternalLink,
  LogOut,
} from "lucide-react";
import styles from "../admin.module.scss";
import { logoutAction } from "../_action";

const navSections = [
  {
    title: "Основні",
    items: [
      { label: "Дашборд", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Картини", href: "/admin/paintings", icon: Palette },
      { label: "Автори", href: "/admin/authors", icon: Users },
      { label: "Товари", href: "/admin/products", icon: ShoppingBag },
      { label: "Пости", href: "/admin/posts", icon: FileText },
    ],
  },
  {
    title: "Організація",
    items: [
      { label: "Колекції", href: "/admin/collections", icon: Sparkles },
      { label: "Категорії", href: "/admin/categories", icon: FolderTree },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <Link href="/admin" className={styles.brandHeader}>
        <div className={styles.brandLogo}>V</div>
        <div className={styles.brandMeta}>
          <span className={styles.brandTitle}>VoytArt</span>
          <span className={styles.brandSubtitle}>Admin Console</span>
        </div>
      </Link>

      {/* Navigation Sections */}
      {navSections.map((section) => (
        <div key={section.title} className={styles.navGroup}>
          <p className={styles.sidebarTitle}>{section.title}</p>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.active : ""}`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <Link href="/" target="_blank" className={styles.siteLink} title="Перейти до головного сайту">
          <span>На сайт</span>
          <ExternalLink size={15} />
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.footerButton}>
            <LogOut size={16} />
            <span>Вийти</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
