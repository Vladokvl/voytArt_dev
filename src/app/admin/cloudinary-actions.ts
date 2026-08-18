"use server";
import { cloudinary } from "~/lib/cloudinary";

export async function getCloudinarySignature(params: Record<string, string | number>) {
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
