import { getCloudinarySignature } from "~/app/admin/cloudinary-actions";

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image"
): Promise<string> {
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
