import {
  getCloudinaryUsageAction,
  getDatabaseUsageAction,
  getServerHealthAction,
} from "./_actions";
import {
  Cloud,
  Database,
  Server,
} from "lucide-react";
import styles from "./system.module.scss";

export const dynamic = "force-dynamic";

function getLevel(percent: number): "low" | "medium" | "high" {
  if (percent > 85) return "high";
  if (percent > 65) return "medium";
  return "low";
}

function getStatusBadge(percent: number) {
  if (percent > 85) return { status: "danger", label: "Майже вичерпано" };
  if (percent > 65) return { status: "warning", label: "Увага" };
  return { status: "ok", label: "В нормі" };
}

export default async function SystemLimitsPage() {
  const [cloudinary, database, server] = await Promise.all([
    getCloudinaryUsageAction(),
    getDatabaseUsageAction(),
    getServerHealthAction(),
  ]);

  const cloudStoragePercent = cloudinary.storage?.percent ?? 0;
  const cloudStorageStatus = getStatusBadge(cloudStoragePercent);

  const dbPercent = database.percent ?? 0;
  const dbStatus = getStatusBadge(dbPercent);

  const memPercent = server.memPercent ?? 0;
  const memStatus = getStatusBadge(memPercent);

  return (
    <div className={styles.container}>
      {/* ── Page Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Стан системи & Ліміти сервісів</h1>
          <p className={styles.subtitle}>
            Моніторинг квот Cloudinary, сховища бази даних PostgreSQL та використання ресурсів сервера
          </p>
        </div>
      </div>

      {/* ── Main Service Limits Grid ── */}
      <div className={styles.cardsGrid}>
        {/* 1. Cloudinary Media Storage */}
        <div className={styles.serviceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.serviceBrand}>
              <div className={styles.serviceIconWrap}>
                <Cloud size={20} />
              </div>
              <div>
                <h2 className={styles.serviceName}>Cloudinary Media</h2>
                <span className={styles.servicePlan}>{cloudinary.plan ?? "Free Plan"} (25 Credits/mo)</span>
              </div>
            </div>
            <span className={styles.statusBadge} data-status={cloudStorageStatus.status}>
              {cloudStorageStatus.label}
            </span>
          </div>

          {cloudinary.error ? (
            <div className={styles.errorBox}>{cloudinary.error}</div>
          ) : (
            <div className={styles.metricsList}>
              {/* Storage */}
              <div className={styles.metricItem}>
                <div className={styles.metricTop}>
                  <span className={styles.metricLabel}>Зайняте сховище фото & відео</span>
                  <span className={styles.metricValue}>
                    {cloudinary.storage?.usedFormatted} / {cloudinary.storage?.limitFormatted} ({cloudStoragePercent}%)
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    data-level={getLevel(cloudStoragePercent)}
                    style={{ width: `${Math.max(3, cloudStoragePercent)}%` }}
                  />
                </div>
              </div>

              {/* Bandwidth */}
              <div className={styles.metricItem}>
                <div className={styles.metricTop}>
                  <span className={styles.metricLabel}>Використаний трафік (Bandwidth)</span>
                  <span className={styles.metricValue}>
                    {cloudinary.bandwidth?.usedFormatted} ({cloudinary.bandwidth?.percent}%)
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    data-level={getLevel(cloudinary.bandwidth?.percent ?? 0)}
                    style={{ width: `${Math.max(3, cloudinary.bandwidth?.percent ?? 0)}%` }}
                  />
                </div>
              </div>

              {/* Transformations */}
              <div className={styles.metricItem}>
                <div className={styles.metricTop}>
                  <span className={styles.metricLabel}>Трансформації картинок</span>
                  <span className={styles.metricValue}>
                    {cloudinary.transformations?.used.toLocaleString("uk-UA")} ({cloudinary.transformations?.percent}%)
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    data-level={getLevel(cloudinary.transformations?.percent ?? 0)}
                    style={{ width: `${Math.max(3, cloudinary.transformations?.percent ?? 0)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Supabase / PostgreSQL Database */}
        <div className={styles.serviceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.serviceBrand}>
              <div className={styles.serviceIconWrap}>
                <Database size={20} />
              </div>
              <div>
                <h2 className={styles.serviceName}>Supabase PostgreSQL</h2>
                <span className={styles.servicePlan}>Free Tier (500 MB Limit)</span>
              </div>
            </div>
            <span className={styles.statusBadge} data-status={dbStatus.status}>
              {dbStatus.label}
            </span>
          </div>

          {database.error ? (
            <div className={styles.errorBox}>{database.error}</div>
          ) : (
            <div className={styles.metricsList}>
              {/* Storage */}
              <div className={styles.metricItem}>
                <div className={styles.metricTop}>
                  <span className={styles.metricLabel}>Розмір бази даних</span>
                  <span className={styles.metricValue}>
                    {database.sizeFormatted} / {database.limitFormatted} ({dbPercent}%)
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    data-level={getLevel(dbPercent)}
                    style={{ width: `${Math.max(3, dbPercent)}%` }}
                  />
                </div>
              </div>

              {/* Table breakdown stats */}
              <div>
                <span className={styles.metricLabel}>Записи в базі даних:</span>
                <div className={styles.tablesGrid}>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.paintings}</span>
                    <span className={styles.statLabel}>Картини</span>
                  </div>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.products}</span>
                    <span className={styles.statLabel}>Товари</span>
                  </div>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.orders}</span>
                    <span className={styles.statLabel}>Замовлення</span>
                  </div>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.authors}</span>
                    <span className={styles.statLabel}>Художники</span>
                  </div>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.collections}</span>
                    <span className={styles.statLabel}>Колекції</span>
                  </div>
                  <div className={styles.tableStatCard}>
                    <span className={styles.statCount}>{database.tables.analyticsEvents}</span>
                    <span className={styles.statLabel}>Аналітика</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Server & Node.js Runtime */}
        <div className={styles.serviceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.serviceBrand}>
              <div className={styles.serviceIconWrap}>
                <Server size={20} />
              </div>
              <div>
                <h2 className={styles.serviceName}>Серверні ресурси</h2>
                <span className={styles.servicePlan}>{server.platform} (Node {server.nodeVersion})</span>
              </div>
            </div>
            <span className={styles.statusBadge} data-status={memStatus.status}>
              {memStatus.label}
            </span>
          </div>

          <div className={styles.metricsList}>
            {/* RAM */}
            <div className={styles.metricItem}>
              <div className={styles.metricTop}>
                <span className={styles.metricLabel}>Оперативна пам&apos;ять (RAM)</span>
                <span className={styles.metricValue}>
                  {server.usedMemMB} MB / {server.totalMemMB} MB ({memPercent}%)
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  data-level={getLevel(memPercent)}
                  style={{ width: `${Math.max(3, memPercent)}%` }}
                />
              </div>
            </div>

            {/* Additional info */}
            <div className={styles.tablesGrid}>
              <div className={styles.tableStatCard}>
                <span className={styles.statCount}>{server.cpuCores}</span>
                <span className={styles.statLabel}>Ядер CPU</span>
              </div>
              <div className={styles.tableStatCard}>
                <span className={styles.statCount}>{server.uptimeHours} год</span>
                <span className={styles.statLabel}>Uptime процесу</span>
              </div>
              <div className={styles.tableStatCard}>
                <span className={styles.statCount}>{server.freeMemMB} MB</span>
                <span className={styles.statLabel}>Вільно RAM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
