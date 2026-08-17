"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "./_actions";
import { type OrderStatus } from "~/../generated/prisma";
import styles from "../admin-table.module.scss";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
    });
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return styles.badgeWarning;
      case "PAID":
        return styles.badgeSuccess;
      case "SHIPPED":
        return styles.badgeNeon;
      case "COMPLETED":
        return styles.badgeSuccess;
      case "CANCELLED":
        return styles.badgeDanger;
      default:
        return styles.badgeNeutral;
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      <select
        value={currentStatus}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
        style={{
          padding: "0.25rem 0.5rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          cursor: isPending ? "wait" : "pointer",
          outline: "none",
        }}
      >
        <option value="NEW">🟡 Нове</option>
        <option value="PAID">🟢 Оплачено</option>
        <option value="SHIPPED">🟣 Відправлено</option>
        <option value="COMPLETED">✅ Виконано</option>
        <option value="CANCELLED">🔴 Скасовано</option>
      </select>
    </div>
  );
}
