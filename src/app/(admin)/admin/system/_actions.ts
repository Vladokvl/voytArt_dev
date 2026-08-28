"use server";

import { db } from "~/lib/db";
import { requireAdmin } from "~/lib/admin-guard";
import os from "os";

export type CloudinaryUsageData = {
  success: boolean;
  plan?: string;
  storage?: {
    usedBytes: number;
    limitBytes: number;
    usedFormatted: string;
    limitFormatted: string;
    percent: number;
  };
  bandwidth?: {
    usedBytes: number;
    limitBytes: number;
    usedFormatted: string;
    limitFormatted: string;
    percent: number;
  };
  transformations?: {
    used: number;
    limit: number;
    percent: number;
  };
  credits?: {
    used: number;
    limit: number;
    percent: number;
  };
  error?: string;
};

export type DatabaseUsageData = {
  success: boolean;
  sizeBytes: number;
  sizeFormatted: string;
  limitBytes: number;
  limitFormatted: string;
  percent: number;
  tables: {
    paintings: number;
    products: number;
    orders: number;
    authors: number;
    collections: number;
    posts: number;
    analyticsEvents: number;
  };
  error?: string;
};

export type ServerHealthData = {
  totalMemMB: number;
  usedMemMB: number;
  freeMemMB: number;
  memPercent: number;
  cpuCores: number;
  uptimeHours: number;
  nodeVersion: string;
  platform: string;
};

function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function getCloudinaryUsageAction(): Promise<CloudinaryUsageData> {
  await requireAdmin();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^["']|["']$/g, "");
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/^["']|["']$/g, "");

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary credentials (CLOUD_NAME, API_KEY, API_SECRET) are not configured in environment variables.",
    };
  }

  try {
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Cloudinary API error (${res.status}): ${errText}` };
    }

    const data = (await res.json()) as {
      plan?: string;
      storage?: { usage?: number; credits_usage?: number };
      bandwidth?: { usage?: number; credits_usage?: number };
      transformations?: { usage?: number; credits_usage?: number };
      credits?: { usage?: number; limit?: number; percent_of_limit?: number };
    };

    // Free plan default = 25 credits = ~25 GB storage / bandwidth
    const creditsUsage = data.credits?.usage ?? 0;
    const creditsLimit = data.credits?.limit ?? 25;
    const creditsPercent = data.credits?.percent_of_limit ?? Math.min(100, Math.round((creditsUsage / creditsLimit) * 100));

    const storageBytes = data.storage?.usage ?? 0;
    const storageLimitBytes = 25 * 1024 * 1024 * 1024; // 25 GB default
    const storagePercent = Math.min(100, Number(((storageBytes / storageLimitBytes) * 100).toFixed(1)));

    const bandwidthBytes = data.bandwidth?.usage ?? 0;
    const bandwidthLimitBytes = 25 * 1024 * 1024 * 1024; // 25 GB default
    const bandwidthPercent = Math.min(100, Number(((bandwidthBytes / bandwidthLimitBytes) * 100).toFixed(1)));

    return {
      success: true,
      plan: data.plan ?? "Free Tier",
      storage: {
        usedBytes: storageBytes,
        limitBytes: storageLimitBytes,
        usedFormatted: formatBytes(storageBytes),
        limitFormatted: formatBytes(storageLimitBytes),
        percent: storagePercent,
      },
      bandwidth: {
        usedBytes: bandwidthBytes,
        limitBytes: bandwidthLimitBytes,
        usedFormatted: formatBytes(bandwidthBytes),
        limitFormatted: formatBytes(bandwidthLimitBytes),
        percent: bandwidthPercent,
      },
      transformations: {
        used: data.transformations?.usage ?? 0,
        limit: 25000,
        percent: Math.min(100, Number((((data.transformations?.usage ?? 0) / 25000) * 100).toFixed(1))),
      },
      credits: {
        used: creditsUsage,
        limit: creditsLimit,
        percent: creditsPercent,
      },
    };
  } catch (err) {
    console.error("Failed to fetch Cloudinary usage:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function getDatabaseUsageAction(): Promise<DatabaseUsageData> {
  await requireAdmin();
  try {
    const [
      sizeResult,
      paintingsCount,
      productsCount,
      ordersCount,
      authorsCount,
      collectionsCount,
      postsCount,
      analyticsCount,
    ] = await Promise.all([
      db.$queryRawUnsafe<Array<{ db_bytes: bigint | number | string }>>(
        "SELECT pg_database_size(current_database()) as db_bytes;"
      ).catch(() => [{ db_bytes: 0 }]),
      db.painting.count(),
      db.product.count(),
      db.order.count(),
      db.author.count(),
      db.collection.count(),
      db.galleryPost.count(),
      db.analyticsEvent.count().catch(() => 0),
    ]);

    const rawBytes = sizeResult[0]?.db_bytes;
    const sizeBytes = typeof rawBytes === "bigint" ? Number(rawBytes) : Number(rawBytes ?? 0);

    // Supabase Free Tier = 500 MB
    const supabaseLimitBytes = 500 * 1024 * 1024;
    const percent = Math.min(100, Number(((sizeBytes / supabaseLimitBytes) * 100).toFixed(1)));

    return {
      success: true,
      sizeBytes,
      sizeFormatted: formatBytes(sizeBytes),
      limitBytes: supabaseLimitBytes,
      limitFormatted: "500 MB",
      percent,
      tables: {
        paintings: paintingsCount,
        products: productsCount,
        orders: ordersCount,
        authors: authorsCount,
        collections: collectionsCount,
        posts: postsCount,
        analyticsEvents: analyticsCount,
      },
    };
  } catch (err) {
    console.error("Failed to fetch Database usage:", err);
    return {
      success: false,
      sizeBytes: 0,
      sizeFormatted: "0 MB",
      limitBytes: 500 * 1024 * 1024,
      limitFormatted: "500 MB",
      percent: 0,
      tables: {
        paintings: 0,
        products: 0,
        orders: 0,
        authors: 0,
        collections: 0,
        posts: 0,
        analyticsEvents: 0,
      },
      error: err instanceof Error ? err.message : "Failed to query database stats",
    };
  }
}

export async function getServerHealthAction(): Promise<ServerHealthData> {
  await requireAdmin();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);

  return {
    totalMemMB: Math.round(totalMem / 1024 / 1024),
    usedMemMB: Math.round(usedMem / 1024 / 1024),
    freeMemMB: Math.round(freeMem / 1024 / 1024),
    memPercent,
    cpuCores: os.cpus().length,
    uptimeHours: Number((process.uptime() / 3600).toFixed(1)),
    nodeVersion: process.version,
    platform: `${os.type()} ${os.arch()}`,
  };
}
