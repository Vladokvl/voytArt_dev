import { db } from "~/lib/db";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Users,
  Smartphone,
  Globe2,
  Share2,
  TrendingUp,
  Monitor,
  ExternalLink,
  Palette,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import styles from "./analytics.module.scss";
import DateRangePicker from "./_DateRangePicker";

type PeriodOption = "today" | "7d" | "30d" | "all";

type SearchParams = Promise<{
  period?: PeriodOption;
  date?: string;
  from?: string;
  to?: string;
}>;

function getCountryFlag(code: string | null): string {
  if (!code || code === "UNKNOWN" || code.length !== 2) return "🌐";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryName(code: string | null): string {
  if (!code || code === "UNKNOWN") return "Не визначено";
  try {
    const dn = new Intl.DisplayNames(["uk"], { type: "region" });
    return dn.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { period = "7d", date, from, to } = await searchParams;

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  let periodLabel = "Останні 7 днів";
  const now = new Date();

  const isSingleDay = Boolean(date ?? period === "today");

  if (date) {
    startDate = new Date(`${date}T00:00:00`);
    endDate = new Date(`${date}T23:59:59.999`);
    periodLabel = `День: ${new Date(date).toLocaleDateString("uk-UA")}`;
  } else if (from ?? to) {
    if (from) startDate = new Date(`${from}T00:00:00`);
    if (to) endDate = new Date(`${to}T23:59:59.999`);
    periodLabel = `Період: ${from ? new Date(from).toLocaleDateString("uk-UA") : "початку"} — ${to ? new Date(to).toLocaleDateString("uk-UA") : "сьогодні"}`;
  } else if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    periodLabel = "Сьогодні";
  } else if (period === "7d") {
    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    periodLabel = "Останні 7 днів";
  } else if (period === "30d") {
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    periodLabel = "Останні 30 днів";
  } else if (period === "all") {
    startDate = undefined;
    endDate = undefined;
    periodLabel = "Весь час";
  }

  const whereClause: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt.gte = startDate;
    if (endDate) whereClause.createdAt.lte = endDate;
  }

  // Fetch metrics and database entities in parallel
  const [
    totalViews,
    events,
    authors,
    products,
    paintings,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: whereClause }),
    db.analyticsEvent.findMany({
      where: whereClause,
      select: {
        id: true,
        path: true,
        pageType: true,
        targetId: true,
        country: true,
        device: true,
        browser: true,
        referer: true,
        visitorHash: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.author.findMany({
      select: { id: true, firstName: true, lastName: true, photoUrl: true },
    }),
    db.product.findMany({
      select: { id: true, title: true, price: true, coverUrl: true, author: { select: { firstName: true, lastName: true } } },
    }).then((rows) => rows.map((p) => ({ ...p, price: Number(p.price) }))),
    db.painting.findMany({
      select: {
        id: true,
        title: true,
        coverUrl: true,
        author: { select: { id: true, firstName: true, lastName: true } },
        inquiries: { select: { id: true } },
      },
    }),
  ]);

  // Compute Unique Visitors & group metrics
  const uniqueHashes = new Set<string>();
  let mobileCount = 0;
  let desktopCount = 0;

  const countryMap: Record<string, number> = {};
  const refererMap: Record<string, number> = {};
  const pathMap: Record<string, { count: number; pageType: string; lastSeen: Date }> = {};
  const dailyTimelineMap: Record<string, { views: number; uniqueSet: Set<string> }> = {};
  const productViewMap: Record<number, number> = {};
  const authorViewMap: Record<number, number> = {};
  const paintingViewMap: Record<number, number> = {};

  for (const ev of events) {
    if (ev.visitorHash) uniqueHashes.add(ev.visitorHash);

    // Device counts
    if (ev.device === "Mobile") mobileCount++;
    else desktopCount++;

    // Country counts
    const c = ev.country ?? "UNKNOWN";
    countryMap[c] = (countryMap[c] ?? 0) + 1;

    // Referrer counts
    const r = ev.referer ?? "Direct";
    refererMap[r] = (refererMap[r] ?? 0) + 1;

    // Path counts
    const currentPath = pathMap[ev.path] ?? { count: 0, pageType: ev.pageType, lastSeen: ev.createdAt };
    currentPath.count++;
    pathMap[ev.path] = currentPath;

    // Painting modal open tracking
    if (ev.pageType === "PAINTING" && ev.targetId) {
      paintingViewMap[ev.targetId] = (paintingViewMap[ev.targetId] ?? 0) + 1;
    } else if (ev.path.includes("painting=")) {
      const match = /painting=(\d+)/.exec(ev.path);
      if (match?.[1]) {
        const pId = parseInt(match[1], 10);
        if (!isNaN(pId)) paintingViewMap[pId] = (paintingViewMap[pId] ?? 0) + 1;
      }
    }

    // Product tracking (e.g. /shop/12 or targetId)
    if (ev.pageType === "PRODUCT" && ev.targetId) {
      productViewMap[ev.targetId] = (productViewMap[ev.targetId] ?? 0) + 1;
    } else if (ev.path.startsWith("/shop/")) {
      const pId = parseInt(ev.path.replace("/shop/", ""), 10);
      if (!isNaN(pId)) {
        productViewMap[pId] = (productViewMap[pId] ?? 0) + 1;
      }
    }

    // Author tracking (pageType === "ARTIST" or targetId or path query)
    if (ev.pageType === "ARTIST" && ev.targetId) {
      authorViewMap[ev.targetId] = (authorViewMap[ev.targetId] ?? 0) + 1;
    } else if (ev.path.includes("artist=")) {
      const match = /artist=(\d+)/.exec(ev.path);
      if (match?.[1]) {
        const aId = parseInt(match[1], 10);
        if (!isNaN(aId)) authorViewMap[aId] = (authorViewMap[aId] ?? 0) + 1;
      }
    }

    // Timeline grouping: hourly if single day, daily (MM-DD) otherwise
    const dateKey = isSingleDay
      ? `${ev.createdAt.getHours().toString().padStart(2, "0")}:00`
      : ev.createdAt.toISOString().slice(5, 10); // MM-DD
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

  // Top Viewed Products with entity details
  const topProductsList = products
    .map((prod) => ({
      ...prod,
      views: productViewMap[prod.id] ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Top Viewed Authors with entity details
  const topAuthorsList = authors
    .map((author) => ({
      ...author,
      views: authorViewMap[author.id] ?? 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Top Paintings (ranked by views descending, then inquiries)
  const topPaintingsList = paintings
    .map((p) => ({
      ...p,
      views: paintingViewMap[p.id] ?? 0,
      inquiriesCount: p.inquiries.length,
    }))
    .sort((a, b) => (b.views !== a.views ? b.views - a.views : b.inquiriesCount - a.inquiriesCount))
    .slice(0, 6);

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
    .slice(0, 8);

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
            {periodLabel} • Реальний трафік без блокувань AdBlock
          </p>
        </div>

        <DateRangePicker
          currentPeriod={period}
          currentDate={date}
          currentFrom={from}
          currentTo={to}
        />
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
            {sortedCountries[0] ? `${getCountryFlag(sortedCountries[0].code)} ${getCountryName(sortedCountries[0].code)}` : "—"}
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

      {/* ── 3-Column Entity Insights: Paintings, Authors, Products ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* 1. Paintings: Views & Inquiries */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.cardTitle}>Перегляди картин</h3>
            <Palette size={18} color="#64748b" />
          </div>
          <div className={styles.listGroup}>
            {topPaintingsList.map((p) => (
              <div key={p.id} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  <div style={{ width: 36, height: 36, position: "relative", borderRadius: 6, overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
                    <Image src={getOptimizedImageUrl(p.coverUrl, { preset: "thumb" })} alt={p.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span className={styles.itemName}>{p.title}</span>
                    <span style={{ fontSize: "0.725rem", color: "#64748b" }}>{p.author.firstName} {p.author.lastName}</span>
                  </div>
                </div>
                <div className={styles.itemRight} style={{ gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 3 }} title="Кількість відкриттів модалки картини">
                    <Eye size={13} color="#64748b" />
                    {p.views}
                  </span>
                  {p.inquiriesCount > 0 && (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857", background: "#ecfdf5", padding: "2px 6px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 3 }} title="Кількість запитів на купівлю">
                      <MessageSquare size={11} />
                      {p.inquiriesCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Top Viewed Artists */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.cardTitle}>Художники</h3>
            <Users size={18} color="#64748b" />
          </div>
          <div className={styles.listGroup}>
            {topAuthorsList.map((a) => (
              <div key={a.id} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  <div style={{ width: 36, height: 36, position: "relative", borderRadius: "50%", overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
                    <Image src={a.photoUrl ? getOptimizedImageUrl(a.photoUrl, { preset: "thumb" }) : "/voyt.svg"} alt={a.firstName} fill style={{ objectFit: "cover" }} />
                  </div>
                  <span className={styles.itemName}>{a.firstName} {a.lastName}</span>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemCount}>{a.views}</span>
                  <span className={styles.itemPercent}>переглядів</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Viewed Merch Products */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.cardTitle}>Популярні товари</h3>
            <ShoppingBag size={18} color="#64748b" />
          </div>
          <div className={styles.listGroup}>
            {topProductsList.map((prod) => (
              <div key={prod.id} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  <div style={{ width: 36, height: 36, position: "relative", borderRadius: 6, overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
                    <Image src={getOptimizedImageUrl(prod.coverUrl, { preset: "thumb" })} alt={prod.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span className={styles.itemName}>{prod.title}</span>
                    <span style={{ fontSize: "0.725rem", color: "#64748b" }}>{prod.price} €</span>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemCount}>{prod.views}</span>
                  <span className={styles.itemPercent}>переглядів</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                      {getCountryName(c.code)}
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
          <h3 className={styles.cardTitle}>Найпопулярніші сторінки</h3>
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
