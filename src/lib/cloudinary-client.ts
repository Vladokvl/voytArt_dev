import { getCloudinarySignature } from "~/app/admin/cloudinary-actions";

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image"
): Promise<string> {
  // Enforce global file size limits
  const isVideo = file.type.startsWith("video/") || resourceType === "video";
  const isImage = file.type.startsWith("image/") || resourceType === "image";

  if (isVideo && file.size > 15 * 1024 * 1024) {
    throw new Error(`Відео занадто велике (${(file.size / (1024 * 1024)).toFixed(1)} MB). Максимальний дозволений розмір для відео — 15 MB.`);
  }
  if (isImage && !isVideo && file.size > 5 * 1024 * 1024) {
    throw new Error(`Зображення занадто велике (${(file.size / (1024 * 1024)).toFixed(1)} MB). Максимальний дозволений розмір для зображення — 5 MB.`);
  }

  // 1. Get the signature from the Server Action
  const { signature, timestamp, apiKey } = await getCloudinarySignature({
    folder,
  });

  // 2. Build the FormData payload for Cloudinary
  const data = new FormData();
  data.append("file", file);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp.toString());
  data.append("signature", signature);
  data.append("folder", folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // 3. Post to the signed upload endpoint
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}
