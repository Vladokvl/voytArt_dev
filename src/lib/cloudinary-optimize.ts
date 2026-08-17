/**
 * Transforms Cloudinary URLs on-the-fly to deliver optimized format (WebP/AVIF),
 * intelligent quality compression (q_auto), and capped pixel dimensions.
 * 
 * If the image is a local asset (/...), external non-Cloudinary URL, or SVG,
 * it returns the original URL untouched.
 */

export type ImageOptimizationPreset = "thumb" | "card" | "medium" | "large" | "banner";

const PRESET_WIDTHS: Record<ImageOptimizationPreset, number> = {
  thumb: 240,   // Admin tables, cart items, mini avatars
  card: 720,    // Grid cards, paintings list, shop catalog
  medium: 1080, // Detail modals, mobile hero backgrounds
  large: 1600,  // Fullscreen painting view, desktop slider
  banner: 1920, // Large wide hero backgrounds
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
  
  // Non-Cloudinary or SVG URLs don't need Cloudinary transformations
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  // If already transformed with f_auto/q_auto, avoid duplicating
  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }

  const preset = options?.preset;
  const targetWidth = options?.width ?? (preset ? PRESET_WIDTHS[preset] : undefined);
  const targetHeight = options?.height;
  const quality = options?.quality ?? "auto";
  const crop = options?.crop ?? "limit";
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
