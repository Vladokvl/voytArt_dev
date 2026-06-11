'use client'
import { usePathname } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import styles from "./admin.module.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;
  return (
    <div className={styles.admin} data-lenis-prevent>
      <AdminSidebar />
      <div className={styles.main}>
        <div className={styles.topbar}>Admin Panel — VoytArt Gallery</div>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
