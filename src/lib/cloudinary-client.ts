import { getCloudinarySignature } from "~/app/(admin)/admin/cloudinary-actions";

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image"
): Promise<string> {
  // Enforce global file size limits
  const isVideo = file.type.startsWith("video/") || resourceType === "video";
  const isImage = file.type.startsWith("image/") || resourceType === "image";

  if (isVideo && file.size > 50 * 1024 * 1024) {
    throw new Error(`Відео занадто велике (${(file.size / (1024 * 1024)).toFixed(1)} MB). Максимальний дозволений розмір для відео — 50 MB.`);
  }
  if (isImage && !isVideo && file.size > 5 * 1024 * 1024) {
    throw new Error(`Зображення занадто велике (${(file.size / (1024 * 1024)).toFixed(1)} MB). Максимальний дозволений розмір для зображення — 5 MB.`);
  }

  // 1. Get the signature from the Server Action
  const { signature, timestamp, apiKey, cloudName: serverCloudName } = await getCloudinarySignature({
    folder,
  });

  // 2. Build the FormData payload for Cloudinary
  const data = new FormData();
  data.append("file", file);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp.toString());
  data.append("signature", signature);
  data.append("folder", folder);

  const cloudName = serverCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    throw new Error("Не знайдено назву Cloudinary cloud name. Перевірте змінні середовища.");
  }
  
  // 3. Post to the signed upload endpoint
  let res: Response;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (networkErr) {
    throw new Error(`Помилка запиту до Cloudinary: ${networkErr instanceof Error ? networkErr.message : String(networkErr)}`);
  }

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const errJson = (await res.json()) as { error?: { message?: string } };
      if (errJson?.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch {
      const errorText = await res.text().catch(() => "");
      if (errorText) errorMsg = errorText;
    }
    throw new Error(`Cloudinary помилка: ${errorMsg}`);
  }

  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}
