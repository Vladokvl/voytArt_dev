/**
 * Universal Image Optimization Utility
 * 
 * Transforms Cloudinary and Unsplash URLs on-the-fly to deliver optimized format (WebP/AVIF),
 * intelligent compression (q_auto), and capped pixel dimensions for blazing-fast load times.
 * 
 * If the image is a local asset (/...) or SVG, it returns the original URL untouched.
 */

export type ImageOptimizationPreset = "thumb" | "card" | "medium" | "large" | "banner";

const PRESET_WIDTHS: Record<ImageOptimizationPreset, number> = {
  thumb: 160,   // Cart items, collection filter chips, admin tables, mini avatars (~5-15 KB)
  card: 640,    // Grid cards, paintings list, shop catalog (~40-80 KB)
  medium: 960,  // Detail modals, mobile hero backgrounds (~100-160 KB)
  large: 1440,  // Fullscreen painting view, desktop slider (~200-350 KB)
  banner: 1920, // Large wide hero backgrounds (~350-500 KB)
};

export function getOptimizedImageUrl(
  url: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
    crop?: "limit" | "fill" | "fit" | "thumb" | "scale";
    format?: "auto" | "webp" | "avif";
    preset?: ImageOptimizationPreset;
  }
): string {
  if (!url || typeof url !== "string") return "";

  const preset = options?.preset;
  const targetWidth = options?.width ?? (preset ? PRESET_WIDTHS[preset] : undefined);
  const targetHeight = options?.height;

  // 1. ── Unsplash Optimization ────────────────────────────────────────────────
  if (url.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(url);
      if (targetWidth) {
        urlObj.searchParams.set("w", String(targetWidth));
      }
      if (targetHeight) {
        urlObj.searchParams.set("h", String(targetHeight));
      }
      const qVal = preset === "thumb" ? "65" : preset === "card" ? "75" : "80";
      urlObj.searchParams.set("q", qVal);
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  // 2. ── Cloudinary Optimization ──────────────────────────────────────────────
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    // If already transformed with f_auto/q_auto, avoid duplicating
    if (url.includes("/f_auto") || url.includes("/q_auto")) {
      return url;
    }

    const quality = options?.quality ?? (preset === "thumb" ? "auto:eco" : "auto");
    const crop = options?.crop ?? (preset === "thumb" ? "fill" : "limit");
    const format = options?.format ?? "auto";

    const transformations: string[] = [
      `f_${format}`,
      `q_${quality}`,
    ];

    if (targetWidth) transformations.push(`w_${targetWidth}`);
    if (targetHeight) transformations.push(`h_${targetHeight}`);
    if (targetWidth || targetHeight) transformations.push(`c_${crop}`);

    const transformString = transformations.join(",");
    return url.replace("/image/upload/", `/image/upload/${transformString}/`);
  }

  return url;
}
