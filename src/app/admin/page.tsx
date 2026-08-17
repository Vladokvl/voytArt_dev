import { db } from "~/lib/db";
import Link from "next/link";
import {
  Palette,
  Users,
  ShoppingBag,
  FileText,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import styles from "./dashboard.module.scss";

export default async function AdminDashboard() {
  const [paintingsCount, authorsCount, productsCount, postsCount] =
    await Promise.all([
      db.painting.count(),
      db.author.count(),
      db.product.count(),
      db.galleryPost.count(),
    ]);

  const stats = [
    {
      label: "Картини",
      count: paintingsCount,
      href: "/admin/paintings",
      icon: Palette,
      bgColor: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      label: "Автори",
      count: authorsCount,
      href: "/admin/authors",
      icon: Users,
      bgColor: "#f5f3ff",
      iconColor: "#7c3aed",
    },
    {
      label: "Товари (Мерч)",
      count: productsCount,
      href: "/admin/products",
      icon: ShoppingBag,
      bgColor: "#ecfdf5",
      iconColor: "#059669",
    },
    {
      label: "Пости блогу",
      count: postsCount,
      href: "/admin/posts",
      icon: FileText,
      bgColor: "#fffbeb",
      iconColor: "#d97706",
    },
  ];

  const quickActions = [
    { label: "Додати картину", href: "/admin/paintings/new" },
    { label: "Додати автора", href: "/admin/authors/new" },
    { label: "Створити товар", href: "/admin/products/new" },
    { label: "Опублікувати пост", href: "/admin/posts/new" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.welcomeHeader}>
        <div className={styles.welcomeText}>
          <h1 className={styles.heading}>Панель керування VoytArt</h1>
          <p className={styles.subheading}>
            Огляд контенту, картин, авторів та асортименту інтернет-магазину
          </p>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div
                  className={styles.statIconWrap}
                  style={{ backgroundColor: stat.bgColor, color: stat.iconColor }}
                >
                  <Icon size={22} />
                </div>
                <ArrowRight size={18} className={styles.statArrow} />
              </div>
              <div className={styles.statBody}>
                <span className={styles.statCount}>{stat.count}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Creation Section */}
      <div>
        <h2 className={styles.sectionTitle}>Швидкі дії</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={styles.actionTile}>
              <PlusCircle size={18} />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
