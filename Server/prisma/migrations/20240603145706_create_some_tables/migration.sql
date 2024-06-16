/*
  Warnings:

  - You are about to drop the column `solQuantity` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "solQuantity",
ADD COLUMN     "colors" INTEGER[],
ADD COLUMN     "customFittedInventoryId" INTEGER,
ADD COLUMN     "productName" TEXT,
ADD COLUMN     "soldQuantity" INTEGER;

-- CreateTable
CREATE TABLE "Flat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "inventoryId" INTEGER,

    CONSTRAINT "Flat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fitted" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inventoryId" INTEGER,

    CONSTRAINT "Fitted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FittedDimensions" (
    "id" SERIAL NOT NULL,
    "fittedId" INTEGER NOT NULL,
    "dimensions" TEXT NOT NULL,

    CONSTRAINT "FittedDimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFittedInventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CustomFittedInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "trekkingId" INTEGER,
    "typeName" TEXT NOT NULL,
    "dimensions" TEXT,
    "colorId" INTEGER,
    "colorname" TEXT,
    "customName" TEXT,
    "width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flat_name_key" ON "Flat"("name");

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fitted" ADD CONSTRAINT "Fitted_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FittedDimensions" ADD CONSTRAINT "FittedDimensions_fittedId_fkey" FOREIGN KEY ("fittedId") REFERENCES "Fitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_customFittedInventoryId_fkey" FOREIGN KEY ("customFittedInventoryId") REFERENCES "CustomFittedInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
