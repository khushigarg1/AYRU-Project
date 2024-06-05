/*
  Warnings:

  - You are about to drop the column `image` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `Fitted` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `Flat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fitted" DROP CONSTRAINT "Fitted_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Flat" DROP CONSTRAINT "Flat_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Fitted" DROP COLUMN "inventoryId";

-- AlterTable
ALTER TABLE "Flat" DROP COLUMN "inventoryId";

-- CreateTable
CREATE TABLE "InventoryFlat" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "flatId" INTEGER NOT NULL,

    CONSTRAINT "InventoryFlat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryFitted" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "fittedId" INTEGER NOT NULL,

    CONSTRAINT "InventoryFitted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryFlat" ADD CONSTRAINT "InventoryFlat_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryFlat" ADD CONSTRAINT "InventoryFlat_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Flat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryFitted" ADD CONSTRAINT "InventoryFitted_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryFitted" ADD CONSTRAINT "InventoryFitted_fittedId_fkey" FOREIGN KEY ("fittedId") REFERENCES "Fitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
