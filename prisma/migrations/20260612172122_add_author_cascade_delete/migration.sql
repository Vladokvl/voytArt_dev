-- DropForeignKey
ALTER TABLE "paintings" DROP CONSTRAINT "paintings_author_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_author_id_fkey";

-- AddForeignKey
ALTER TABLE "paintings" ADD CONSTRAINT "paintings_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
