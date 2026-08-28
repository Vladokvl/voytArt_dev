"use client";

import { useTransition } from "react";
import { updateInquiryStatusAction } from "./_actions";
import { type InquiryStatus } from "~/../generated/prisma";

export default function InquiryStatusSelect({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: InquiryStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: InquiryStatus) => {
    startTransition(async () => {
      await updateInquiryStatusAction(id, newStatus);
    });
  };

  const getStatusStyle = (s: InquiryStatus) => {
    switch (s) {
      case "NEW":
        return { bg: "#fef3c7", border: "#fde68a", color: "#92400e" };
      case "IN_PROGRESS":
        return { bg: "#e0f2fe", border: "#bae6fd", color: "#0369a1" };
      case "CONTACTED":
        return { bg: "#f3e8ff", border: "#e9d5ff", color: "#7e22ce" };
      case "SOLD":
        return { bg: "#ecfdf5", border: "#a7f3d0", color: "#047857" };
      case "CANCELLED":
        return { bg: "#f1f5f9", border: "#e2e8f0", color: "#64748b" };
    }
  };

  const style = getStatusStyle(currentStatus);

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <select
        value={currentStatus}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
        style={{
          padding: "0.35rem 0.65rem",
          fontSize: "0.8rem",
          fontWeight: 700,
          borderRadius: "8px",
          border: `1px solid ${style.border}`,
          backgroundColor: style.bg,
          color: style.color,
          cursor: isPending ? "wait" : "pointer",
          outline: "none",
          transition: "all 0.15s ease",
        }}
      >
        <option value="NEW">🟡 Новий</option>
        <option value="IN_PROGRESS">🔵 В обробці</option>
        <option value="CONTACTED">🟣 Зв&apos;язалися</option>
        <option value="SOLD">🟢 Продано</option>
        <option value="CANCELLED">⚪ Скасовано</option>
      </select>
    </div>
  );
}
