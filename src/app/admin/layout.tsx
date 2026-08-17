"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AdminSidebar from "./_components/AdminSidebar";
import { BreadcrumbProvider, useBreadcrumb } from "./_components/BreadcrumbContext";
import styles from "./admin.module.scss";

const sectionLabels: Record<string, { title: string; newLabel: string }> = {
  paintings: { title: "Картини", newLabel: "Нова картина" },
  authors: { title: "Автори", newLabel: "Новий автор" },
  products: { title: "Товари", newLabel: "Новий товар" },
  orders: { title: "Замовлення", newLabel: "Замовлення" },
  posts: { title: "Пости", newLabel: "Новий пост" },
  categories: { title: "Категорії", newLabel: "Нова категорія" },
  collections: { title: "Колекції", newLabel: "Нова колекція" },
};

function BreadcrumbsView() {
  const pathname = usePathname();
  const { dynamicTitle } = useBreadcrumb();

  const segments = pathname.split("/").filter(Boolean); // e.g. ["admin", "authors", "edit", "4"]

  const crumbs: { label: string; url?: string; isLast: boolean }[] = [
    { label: "Дашборд", url: "/admin", isLast: segments.length === 1 },
  ];

  if (segments.length > 1 && segments[1]) {
    const sectionKey = segments[1];
    const sectionInfo = sectionLabels[sectionKey];
    const sectionTitle = sectionInfo?.title ?? segments[1];
    const sectionUrl = `/admin/${segments[1]}`;

    if (segments.length === 2) {
      crumbs.push({ label: sectionTitle, isLast: true });
    } else if (segments.length >= 3) {
      crumbs.push({ label: sectionTitle, url: sectionUrl, isLast: false });

      const sub = segments[2];
      if (sub === "new") {
        crumbs.push({
          label: sectionInfo?.newLabel ?? "Створення",
          isLast: true,
        });
      } else if (sub === "edit") {
        // Render item title directly without raw ID or "Редагування > 4"
        crumbs.push({
          label: dynamicTitle ?? "Редагування",
          isLast: true,
        });
      } else {
        crumbs.push({
          label: dynamicTitle ?? sub ?? "",
          isLast: true,
        });
      }
    }
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
      {crumbs.map((crumb, i) => (
        <span key={crumb.label + i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {i > 0 && <span className={styles.separator}><ChevronRight size={14} /></span>}
          {crumb.isLast || !crumb.url ? (
            <span className={styles.currentCrumb}>{crumb.label}</span>
          ) : (
            <Link href={crumb.url}>{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <BreadcrumbProvider>
      <div className={styles.admin} data-lenis-prevent>
        <AdminSidebar />
        <div className={styles.main}>
          <header className={styles.topbar}>
            <BreadcrumbsView />

            <div className={styles.topbarRight}>
              <div className={styles.liveBadge}>
                <span className={styles.pulseDot} />
                <span>Production Live</span>
              </div>
            </div>
          </header>

          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
