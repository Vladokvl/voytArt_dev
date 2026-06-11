-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "photo_public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "cover_photo_public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "gallery_post_media" ADD COLUMN     "public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "gallery_posts" ADD COLUMN     "cover_public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "painting_media" ADD COLUMN     "public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "paintings" ADD COLUMN     "cover_public_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "public_id" TEXT NOT NULL DEFAULT '';
