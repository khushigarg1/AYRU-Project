/*
  Warnings:

  - You are about to drop the column `couriername` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `imageurl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `selectedCustomFittedItem` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `selectedFittedItem` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `selectedFlatItem` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sizeOption` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trekkingId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trekkingid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "couriername",
DROP COLUMN "dimensions",
DROP COLUMN "height",
DROP COLUMN "imageurl",
DROP COLUMN "length",
DROP COLUMN "quantity",
DROP COLUMN "selectedCustomFittedItem",
DROP COLUMN "selectedFittedItem",
DROP COLUMN "selectedFlatItem",
DROP COLUMN "sizeOption",
DROP COLUMN "trekkingId",
DROP COLUMN "trekkingid",
DROP COLUMN "unit",
DROP COLUMN "width",
ALTER COLUMN "inventoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "trekkingId" TEXT,
    "trekkingid" TEXT,
    "couriername" TEXT,
    "imageurl" TEXT,
    "sizeOption" TEXT,
    "selectedFlatItem" TEXT,
    "selectedFittedItem" TEXT,
    "selectedCustomFittedItem" TEXT,
    "dimensions" TEXT,
    "unit" TEXT,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
