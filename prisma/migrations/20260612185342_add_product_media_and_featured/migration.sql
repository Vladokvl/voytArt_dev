-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cover_public_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cover_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false;
