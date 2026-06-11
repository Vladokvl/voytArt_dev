import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export type CloudinaryResourceType = 'image' | 'video'

/**
 * Upload a file buffer or base64 string to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImage(
  file: string, // base64 data URI або URL
  folder: string, // наприклад: 'paintings', 'authors', 'products'
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `voytart/${folder}`,
    resource_type: 'image',
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getPublicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const uploadIndex = parsed.pathname.indexOf('/upload/')
    if (uploadIndex === -1) return null

    const pathAfterUpload = parsed.pathname.slice(uploadIndex + '/upload/'.length)
    const withoutTransforms = pathAfterUpload
      .split('/')
      .filter((part) => !part.startsWith('v') || Number.isNaN(Number(part.slice(1))))
      .join('/')

    if (!withoutTransforms) return null

    return withoutTransforms.replace(/\.[^/.]+$/, '')
  } catch {
    return null
  }
}

export async function deleteAsset(
  publicId: string,
  resourceType: CloudinaryResourceType = 'image',
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  })
}

/**
 * Delete Cloudinary asset by full secure_url.
 * Supports both image and video delivery URLs.
 */
export async function deleteAssetByUrl(url: string): Promise<void> {
  const publicId = getPublicIdFromCloudinaryUrl(url)
  if (!publicId) return

  const resourceType: CloudinaryResourceType = url.includes('/video/upload/') ? 'video' : 'image'
  await deleteAsset(publicId, resourceType)
}
