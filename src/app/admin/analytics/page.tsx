import { db } from "~/lib/db";
import Link from "next/link";
import {
  Eye,
  Users,
  Smartphone,
  Globe2,
  Share2,
  TrendingUp,
  Monitor,
  ExternalLink,
} from "lucide-react";
import styles from "./analytics.module.scss";

type PeriodOption = "today" | "7d" | "30d" | "all";

type SearchParams = Promise<{
  period?: PeriodOption;
}>;

function getCountryFlag(code: string | null): string {
  if (!code || code === "UNKNOWN" || code.length !== 2) return "🌐";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { period = "7d" } = await searchParams;

  let startDate: Date | undefined;
  const now = new Date();

  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "7d") {
    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "30d") {
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const whereClause = startDate ? { createdAt: { gte: startDate } } : {};

  // Fetch metrics in parallel
  const [
    totalViews,
    events,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: whereClause }),
    db.analyticsEvent.findMany({
      where: whereClause,
      select: {
        id: true,
        path: true,
        pageType: true,
        country: true,
        device: true,
        browser: true,
        referer: true,
        visitorHash: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Compute Unique Visitors
  const uniqueHashes = new Set<string>();
  let mobileCount = 0;
  let desktopCount = 0;

  const countryMap: Record<string, number> = {};
  const refererMap: Record<string, number> = {};
  const pathMap: Record<string, { count: number; pageType: string; lastSeen: Date }> = {};
  const dailyTimelineMap: Record<string, { views: number; uniqueSet: Set<string> }> = {};

  for (const ev of events) {
    if (ev.visitorHash) uniqueHashes.add(ev.visitorHash);

    // Device counts
    if (ev.device === "Mobile") mobileCount++;
    else desktopCount++;

    // Country counts
    const c = ev.country || "UNKNOWN";
    countryMap[c] = (countryMap[c] || 0) + 1;

    // Referrer counts
    const r = ev.referer || "Direct";
    refererMap[r] = (refererMap[r] || 0) + 1;

    // Path counts
    const currentPath = pathMap[ev.path] ?? { count: 0, pageType: ev.pageType, lastSeen: ev.createdAt };
    currentPath.count++;
    pathMap[ev.path] = currentPath;

    // Daily timeline grouping
    const dateKey = ev.createdAt.toISOString().slice(5, 10); // MM-DD
    const currentDay = dailyTimelineMap[dateKey] ?? { views: 0, uniqueSet: new Set<string>() };
    currentDay.views++;
    if (ev.visitorHash) {
      currentDay.uniqueSet.add(ev.visitorHash);
    }
    dailyTimelineMap[dateKey] = currentDay;
  }

  const uniqueVisitorsCount = uniqueHashes.size;
  const mobilePercent = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0;

  // Top Countries list
  const sortedCountries = Object.entries(countryMap)
    .map(([code, count]) => ({
      code,
      count,
      percent: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Top Referrers list
  const sortedReferrers = Object.entries(refererMap)
    .map(([name, count]) => ({
      name,
      count,
      percent: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Top Pages list
  const sortedPages = Object.entries(pathMap)
    .map(([path, data]) => ({
      path,
      count: data.count,
      pageType: data.pageType,
      lastSeen: data.lastSeen,
      percent: totalViews > 0 ? Math.round((data.count / totalViews) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Timeline list (reverse chronological for display left-to-right)
  const timelineEntries = Object.entries(dailyTimelineMap)
    .map(([date, data]) => ({
      date,
      views: data.views,
      uniques: data.uniqueSet.size,
    }))
    .reverse()
    .slice(-14);

  const maxDailyViews = Math.max(1, ...timelineEntries.map((e) => e.views));

  return (
    <div className={styles.container}>
      {/* ── Page Header & Period Selector ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Статистика відвідувачів</h1>
          <p className={styles.subtitle}>
            Реальний трафік, канали переходів та географія відвідувачів без блокувань AdBlock
          </p>
        </div>

        <div className={styles.periodFilter}>
          <Link
            href="/admin/analytics?period=today"
            className={`${styles.periodBtn} ${period === "today" ? styles.periodBtnActive : ""}`}
          >
            Сьогодні
          </Link>
          <Link
            href="/admin/analytics?period=7d"
            className={`${styles.periodBtn} ${period === "7d" ? styles.periodBtnActive : ""}`}
          >
            7 днів
          </Link>
          <Link
            href="/admin/analytics?period=30d"
            className={`${styles.periodBtn} ${period === "30d" ? styles.periodBtnActive : ""}`}
          >
            30 днів
          </Link>
          <Link
            href="/admin/analytics?period=all"
            className={`${styles.periodBtn} ${period === "all" ? styles.periodBtnActive : ""}`}
          >
            Весь час
          </Link>
        </div>
      </div>

      {/* ── Top Metric Cards (KPIs) ── */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Переглядів сторінок</span>
            <div className={styles.kpiIconWrap}>
              <Eye size={18} />
            </div>
          </div>
          <span className={styles.kpiValue}>{totalViews.toLocaleString("uk-UA")}</span>
          <span className={styles.kpiSub}>Загальна активність на сайті</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Унікальних людей</span>
            <div className={styles.kpiIconWrap}>
              <Users size={18} />
            </div>
          </div>
          <span className={styles.kpiValue}>{uniqueVisitorsCount.toLocaleString("uk-UA")}</span>
          <span className={styles.kpiSub}>Унікальні пристрої за період</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Мобільний трафік</span>
            <div className={styles.kpiIconWrap}>
              <Smartphone size={18} />
            </div>
          </div>
          <span className={styles.kpiValue}>{mobilePercent}%</span>
          <span className={styles.kpiSub}>
            {mobileCount} моб. / {desktopCount} десктоп
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Головна країна</span>
            <div className={styles.kpiIconWrap}>
              <Globe2 size={18} />
            </div>
          </div>
          <span className={styles.kpiValue}>
            {sortedCountries[0] ? `${getCountryFlag(sortedCountries[0].code)} ${sortedCountries[0].code}` : "—"}
          </span>
          <span className={styles.kpiSub}>
            {sortedCountries[0] ? `${sortedCountries[0].count} переходів (${sortedCountries[0].percent}%)` : "Немає даних"}
          </span>
        </div>
      </div>

      {/* ── Daily Timeline Chart ── */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.cardTitle}>Динаміка відвідувань за днями</h2>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDotViews} />
              <span>Всього переглядів</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotUniques} />
              <span>Унікальних відвідувачів</span>
            </div>
          </div>
        </div>

        {timelineEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <TrendingUp size={36} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
            <p>Ще немає зареєстрованих переходів за обраний період</p>
          </div>
        ) : (
          <div className={styles.timelineBars}>
            {timelineEntries.map((entry) => {
              const viewHeight = Math.max(8, Math.round((entry.views / maxDailyViews) * 100));
              const uniqueHeight = Math.max(8, Math.round((entry.uniques / maxDailyViews) * 100));
              return (
                <div key={entry.date} className={styles.barCol}>
                  <div className={styles.barTooltip}>
                    <strong>{entry.date}</strong>: {entry.views} переглядів, {entry.uniques} унікальних
                  </div>
                  <div className={styles.barsGroup}>
                    <div className={styles.barView} style={{ height: `${viewHeight}%` }} />
                    <div className={styles.barUnique} style={{ height: `${uniqueHeight}%` }} />
                  </div>
                  <span className={styles.barDateLabel}>{entry.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Two Columns: Countries & Referrers ── */}
      <div className={styles.twoColGrid}>
        {/* Countries Breakdown */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.cardTitle}>Географія відвідувачів</h3>
            <Globe2 size={18} color="#64748b" />
          </div>

          {sortedCountries.length === 0 ? (
            <div className={styles.emptyState}>Немає даних про країни</div>
          ) : (
            <div className={styles.listGroup}>
              {sortedCountries.map((c) => (
                <div key={c.code} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <span className={styles.countryFlag}>{getCountryFlag(c.code)}</span>
                    <span className={styles.itemName}>
                      {c.code === "UA" && "Україна"}
                      {c.code === "PL" && "Польща"}
                      {c.code === "US" && "США"}
                      {c.code === "DE" && "Німеччина"}
                      {c.code === "GB" && "Велика Британія"}
                      {c.code === "UNKNOWN" && "Не визначено"}
                      {c.code !== "UA" && c.code !== "PL" && c.code !== "US" && c.code !== "DE" && c.code !== "GB" && c.code !== "UNKNOWN" && c.code}
                    </span>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.itemProgress}>
                      <div className={styles.itemProgressBar} style={{ width: `${c.percent}%` }} />
                    </div>
                    <span className={styles.itemCount}>{c.count}</span>
                    <span className={styles.itemPercent}>{c.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic Referrers */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.cardTitle}>Джерела переходу</h3>
            <Share2 size={18} color="#64748b" />
          </div>

          {sortedReferrers.length === 0 ? (
            <div className={styles.emptyState}>Немає даних про джерела</div>
          ) : (
            <div className={styles.listGroup}>
              {sortedReferrers.map((r) => (
                <div key={r.name} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemName}>{r.name}</span>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.itemProgress}>
                      <div className={styles.itemProgressBar} style={{ width: `${r.percent}%` }} />
                    </div>
                    <span className={styles.itemCount}>{r.count}</span>
                    <span className={styles.itemPercent}>{r.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Visited Pages & Products ── */}
      <div className={styles.tableCard}>
        <div className={styles.panelHeader}>
          <h3 className={styles.cardTitle}>Найпопулярніші сторінки та товари</h3>
          <Monitor size={18} color="#64748b" />
        </div>

        {sortedPages.length === 0 ? (
          <div className={styles.emptyState}>Дані про переглянуті сторінки відсутні</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Сторінка (URL)</th>
                <th className={styles.th}>Розділ</th>
                <th className={styles.th}>Переглядів</th>
                <th className={styles.th}>Частка</th>
                <th className={styles.th} style={{ textAlign: "right" }}>Перейти</th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.map((p) => (
                <tr key={p.path}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>
                    {p.path}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.pageTypeBadge} data-type={p.pageType}>
                      {p.pageType}
                    </span>
                  </td>
                  <td className={styles.td} style={{ fontWeight: 700 }}>
                    {p.count.toLocaleString("uk-UA")}
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className={styles.itemProgress} style={{ width: 60 }}>
                        <div className={styles.itemProgressBar} style={{ width: `${p.percent}%` }} />
                      </div>
                      <span>{p.percent}%</span>
                    </div>
                  </td>
                  <td className={styles.td} style={{ textAlign: "right" }}>
                    <Link
                      href={p.path}
                      target="_blank"
                      style={{ color: "#64748b", display: "inline-flex", alignItems: "center" }}
                    >
                      <ExternalLink size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
