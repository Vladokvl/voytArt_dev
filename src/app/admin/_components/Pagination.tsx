"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.scss";

export default function Pagination({
  totalItems,
  pageSize = 20,
}: {
  totalItems: number;
  pageSize?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Показано {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} з {totalItems}
      </div>
      <div className={styles.controls}>
        <Link
          href={createPageURL(currentPage - 1)}
          className={currentPage <= 1 ? styles.disabled : styles.button}
          aria-disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
        </Link>
        <span className={styles.pageInfo}>
          {currentPage} / {totalPages}
        </span>
        <Link
          href={createPageURL(currentPage + 1)}
          className={currentPage >= totalPages ? styles.disabled : styles.button}
          aria-disabled={currentPage >= totalPages}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
