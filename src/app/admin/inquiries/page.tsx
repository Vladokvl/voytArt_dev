import { db, type Prisma } from "~/lib/db";
import Link from "next/link";
import styles from "../admin-table.module.scss";
import { MessageCircle, Clock } from "lucide-react";
import InquiryStatusSelect from "./_InquiryStatusSelect";
import DeleteInquiryButton from "./_DeleteButton";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import SortableHeader from "../_components/SortableHeader";

type InquirySortField = "createdAt" | "customerName" | "status";

type SearchParams = Promise<{
  sortBy?: InquirySortField;
  sortDir?: "asc" | "desc";
  status?: "NEW" | "IN_PROGRESS" | "CONTACTED" | "SOLD" | "CANCELLED" | "ALL";
}>;

export const dynamic = "force-dynamic";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sortBy = "createdAt", sortDir = "desc", status = "ALL" } = await searchParams;
  const validSortDir = sortDir === "asc" ? "asc" : "desc";

  let orderByQuery: Prisma.PaintingInquiryOrderByWithRelationInput = { createdAt: validSortDir };
  if (sortBy === "customerName") {
    orderByQuery = { customerName: validSortDir };
  } else if (sortBy === "status") {
    orderByQuery = { status: validSortDir };
  } else if (sortBy === "createdAt") {
    orderByQuery = { createdAt: validSortDir };
  }

  const whereClause: Prisma.PaintingInquiryWhereInput =
    status !== "ALL" ? { status } : {};

  const [inquiries, counts] = await Promise.all([
    db.paintingInquiry.findMany({
      where: whereClause,
      include: {
        painting: {
          include: {
            author: true,
          },
        },
      },
      orderBy: orderByQuery,
    }),
    Promise.all([
      db.paintingInquiry.count(),
      db.paintingInquiry.count({ where: { status: "NEW" } }),
      db.paintingInquiry.count({ where: { status: "IN_PROGRESS" } }),
      db.paintingInquiry.count({ where: { status: "CONTACTED" } }),
      db.paintingInquiry.count({ where: { status: "SOLD" } }),
    ]),
  ]);

  const [totalCount, newCount, inProgressCount, contactedCount, soldCount] = counts;

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Запити на картини</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Звернення та ліди покупців щодо оригінальних робіт галереї
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/inquiries"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            background: status === "ALL" ? "#0f172a" : "#ffffff",
            color: status === "ALL" ? "#ffffff" : "#64748b",
            border: "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          Всі ({totalCount})
        </Link>
        <Link
          href="/admin/inquiries?status=NEW"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            background: status === "NEW" ? "#fef3c7" : "#ffffff",
            color: status === "NEW" ? "#92400e" : "#64748b",
            border: status === "NEW" ? "1px solid #fde68a" : "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          🟡 Нові ({newCount})
        </Link>
        <Link
          href="/admin/inquiries?status=IN_PROGRESS"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            background: status === "IN_PROGRESS" ? "#e0f2fe" : "#ffffff",
            color: status === "IN_PROGRESS" ? "#0369a1" : "#64748b",
            border: status === "IN_PROGRESS" ? "1px solid #bae6fd" : "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          🔵 В обробці ({inProgressCount})
        </Link>
        <Link
          href="/admin/inquiries?status=CONTACTED"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            background: status === "CONTACTED" ? "#f3e8ff" : "#ffffff",
            color: status === "CONTACTED" ? "#7e22ce" : "#64748b",
            border: status === "CONTACTED" ? "1px solid #e9d5ff" : "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          🟣 Зв&apos;язалися ({contactedCount})
        </Link>
        <Link
          href="/admin/inquiries?status=SOLD"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            background: status === "SOLD" ? "#ecfdf5" : "#ffffff",
            color: status === "SOLD" ? "#047857" : "#64748b",
            border: status === "SOLD" ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          🟢 Продано ({soldCount})
        </Link>
      </div>

      {/* Inquiries Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <SortableHeader field="createdAt" label="№ Запиту / Дата" defaultField="createdAt" />
              <th className={styles.th}>Картина</th>
              <SortableHeader field="customerName" label="Клієнт" defaultField="createdAt" />
              <th className={styles.th}>Контакт та Канал</th>
              <th className={styles.th}>Повідомлення</th>
              <SortableHeader field="status" label="Статус" defaultField="createdAt" />
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Запитів на картини ще немає
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => {
                const isTelegramContact = inq.customerContact.startsWith("@") || inq.preferredContact === "TELEGRAM";
                const telegramUsername = inq.customerContact.replace("@", "").trim();

                return (
                  <tr key={inq.id}>
                    {/* Inquiry Number & Date */}
                    <td className={styles.td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>
                          {inq.inquiryNumber}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Clock size={11} />
                          <span>
                            {new Date(inq.createdAt).toLocaleDateString("uk-UA")}{" "}
                            {new Date(inq.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </span>
                      </div>
                    </td>

                    {/* Painting Preview */}
                    <td className={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getOptimizedImageUrl(inq.painting.coverUrl, { preset: "thumb" })}
                          alt={inq.painting.title}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 6,
                            objectFit: "cover",
                            border: "1px solid #e2e8f0",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a" }}>
                            {inq.painting.title}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {inq.painting.author.firstName} {inq.painting.author.lastName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className={styles.td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>{inq.customerName}</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          Звернення з сайту
                        </span>
                      </div>
                    </td>

                    {/* Contact & Channel */}
                    <td className={styles.td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.875rem" }}>
                            {inq.customerContact}
                          </span>
                          {isTelegramContact && (
                            <a
                              href={`https://t.me/${telegramUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#0284c7",
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "2px 5px",
                                background: "#f0f9ff",
                                borderRadius: 4,
                                border: "1px solid #bae6fd",
                              }}
                              title="Відкрити чат у Telegram"
                            >
                              <MessageCircle size={13} style={{ marginRight: 2 }} />
                              <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>TG</span>
                            </a>
                          )}
                        </div>

                        {/* Preferred channel badge */}
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              background: "#f1f5f9",
                              color: "#475569",
                              letterSpacing: "0.04em",
                              width: "fit-content",
                            }}
                          >
                            Канал: {inq.preferredContact}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Message */}
                    <td className={styles.td} style={{ maxWidth: 240 }}>
                      {inq.message ? (
                        <div
                          style={{
                            fontSize: "0.825rem",
                            color: "#334155",
                            background: "#f8fafc",
                            border: "1px solid #f1f5f9",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "6px",
                            lineHeight: 1.4,
                          }}
                        >
                          «{inq.message}»
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>
                          Без додаткового тексту
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className={styles.td}>
                      <InquiryStatusSelect id={inq.id} currentStatus={inq.status} />
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                        <DeleteInquiryButton id={inq.id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
