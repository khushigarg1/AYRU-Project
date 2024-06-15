/*
  Warnings:

  - You are about to drop the `Colors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Colors" DROP CONSTRAINT "Colors_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "inventoryId" INTEGER;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Colors";

-- CreateTable
CREATE TABLE "ColorVariation" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColorVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InventoryToInventory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryToInventory_AB_unique" ON "_InventoryToInventory"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryToInventory_B_index" ON "_InventoryToInventory"("B");

-- AddForeignKey
ALTER TABLE "ColorVariation" ADD CONSTRAINT "ColorVariation_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorVariation" ADD CONSTRAINT "ColorVariation_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToInventory" ADD CONSTRAINT "_InventoryToInventory_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToInventory" ADD CONSTRAINT "_InventoryToInventory_B_fkey" FOREIGN KEY ("B") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
