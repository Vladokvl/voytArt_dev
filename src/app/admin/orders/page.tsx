import { db } from "~/lib/db";
import styles from "../admin-table.module.scss";
import { Package, User, Phone, MapPin, Calendar, Clock } from "lucide-react";
import OrderStatusSelect from "./_OrderStatusSelect";
import DeleteOrderButton from "./_DeleteButton";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          product: { select: { coverUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Замовлення магазину</h1>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>№ Замовлення</th>
              <th className={styles.th}>Клієнт та Контакти</th>
              <th className={styles.th}>Доставка (Нова Пошта)</th>
              <th className={styles.th}>Товари та розміри</th>
              <th className={styles.th}>Сума</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th} style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Замовлень ще немає
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className={styles.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>
                        {o.orderNumber}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={11} />
                        <span>{new Date(o.createdAt).toLocaleDateString("uk-UA")} {new Date(o.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</span>
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{o.customerName}</span>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{o.customerPhone}</span>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{o.customerEmail}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span style={{ fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin size={13} color="#dc2626" />
                        <span>{o.deliveryCity}</span>
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        {o.deliveryAddress}
                      </span>
                      {o.comment && (
                        <span style={{ fontSize: "0.75rem", color: "#d97706", fontStyle: "italic" }}>
                          «{o.comment}»
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                          {item.product?.coverUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.coverUrl}
                              alt=""
                              style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }}
                            />
                          )}
                          <div>
                            <span style={{ fontWeight: 500 }}>{item.title}</span>
                            {item.variantTitle && (
                              <span style={{ color: "#7c3aed", fontWeight: 600, marginLeft: "0.35rem", fontSize: "0.78rem" }}>
                                ({item.variantTitle})
                              </span>
                            )}
                            <span style={{ color: "#64748b", marginLeft: "0.35rem" }}>
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className={styles.td} style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                    {o.totalAmount.toLocaleString("uk-UA")} €
                  </td>
                  <td className={styles.td}>
                    <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                      <DeleteOrderButton id={o.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
