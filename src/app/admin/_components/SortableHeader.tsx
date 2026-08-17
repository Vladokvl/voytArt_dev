"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react";
import tableStyles from "../admin-table.module.scss";

export default function SortableHeader({
  field,
  label,
  defaultField = "sortOrder",
  className,
}: {
  field: string;
  label: string;
  defaultField?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") ?? defaultField;
  const currentSortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "asc";

  const isActive = currentSortBy === field;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", field);
    if (isActive) {
      params.set("sortDir", currentSortDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sortDir", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <th
      className={`${className ?? tableStyles.th} ${tableStyles.thSortable} ${
        isActive ? tableStyles.thSortActive : ""
      }`}
      onClick={handleClick}
      title={`Сортувати за: ${label} (${isActive && currentSortDir === "asc" ? "за спаданням" : "за зростанням"})`}
    >
      <div className={tableStyles.sortHeaderWrap}>
        <span>{label}</span>
        {isActive && (
          currentSortDir === "asc" ? (
            <ArrowUp size={14} className={tableStyles.sortIcon} />
          ) : (
            <ArrowDown size={14} className={tableStyles.sortIcon} />
          )
        )}
      </div>
    </th>
  );
}
