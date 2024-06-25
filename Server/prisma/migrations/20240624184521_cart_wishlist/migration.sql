/*
  Warnings:

  - You are about to drop the column `products` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,inventoryId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,inventoryId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "products",
ADD COLUMN     "inventoryId" INTEGER,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productId",
ADD COLUMN     "inventoryId" INTEGER;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "products",
ADD COLUMN     "inventoryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_inventoryId_key" ON "Cart"("userId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_inventoryId_key" ON "Wishlist"("userId", "inventoryId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
