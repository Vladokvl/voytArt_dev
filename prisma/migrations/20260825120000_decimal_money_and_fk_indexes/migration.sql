-- AlterTable: гроші мають зберігатися як Decimal, а не Float (помилки округлення)
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
ALTER TABLE "product_variants" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
ALTER TABLE "orders" ALTER COLUMN "total_amount" SET DATA TYPE DECIMAL(10,2);
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex: PostgreSQL не створює індекси для FK автоматично
CREATE INDEX "painting_media_painting_id_idx" ON "painting_media"("painting_id");
CREATE INDEX "gallery_post_media_post_id_idx" ON "gallery_post_media"("post_id");
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");
CREATE INDEX "product_images_variant_id_idx" ON "product_images"("variant_id");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");
CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");
