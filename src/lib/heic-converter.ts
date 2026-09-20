/**
 * Helper to detect and convert Apple HEIC / HEIF photos to standard JPEG in the browser.
 */

export function isHeicFile(file: File | Blob | null | undefined): boolean {
  if (!file) return false;
  const name = "name" in file ? file.name.toLowerCase() : "";
  const type = file.type ? file.type.toLowerCase() : "";

  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    type === "image/heic" ||
    type === "image/heif" ||
    type === "image/heic-sequence" ||
    type === "image/heif-sequence"
  );
}

export async function convertHeicToJpeg(file: File): Promise<File> {
  if (typeof window === "undefined" || !isHeicFile(file)) {
    return file;
  }

  try {
    // Dynamically import heic2any only in browser / client side
    const heic2anyModule = await import("heic2any");
    const heic2any = heic2anyModule.default ?? heic2anyModule;

    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.95,
    });

    const blob = Array.isArray(result) ? result[0] : result;
    if (!blob) {
      throw new Error("Порожній результат після конвертації HEIC");
    }

    const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], newFileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Помилка конвертації HEIC у JPEG:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Не вдалося конвертувати формат HEIC у JPEG"
    );
  }
}
