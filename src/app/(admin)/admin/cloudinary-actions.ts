"use server";
import { cloudinary } from "~/lib/cloudinary";
import { requireAdmin } from "~/lib/admin-guard";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_FORMATS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif", "mp4", "webm", "mov"]);

export async function getCloudinarySignature(params: Record<string, string | number>) {
  await requireAdmin();

  // Server-side validation of upload limits (duplicates the client-side checks)
  const fileSize = Number(params.filesize ?? 0);
  if (fileSize > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the maximum allowed size of 50MB");
  }
  const folder = typeof params.folder === "string" ? params.folder : "";
  if (!folder.startsWith("voytart")) {
    throw new Error("Invalid upload folder");
  }
  const format = String(params.format ?? "").toLowerCase();
  if (format && !ALLOWED_FORMATS.has(format)) {
    throw new Error("File format is not allowed");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    ...params,
    timestamp,
  };

  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/^["']|["']$/g, "") ?? "";
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/^["']|["']$/g, "") ?? "";

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret
  );

  return {
    signature,
    timestamp,
    apiKey,
  };
}
