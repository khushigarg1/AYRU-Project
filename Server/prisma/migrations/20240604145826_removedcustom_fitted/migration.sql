/*
  Warnings:

  - You are about to drop the column `customFittedInventoryId` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_customFittedInventoryId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "customFittedInventoryId";

-- CreateTable
CREATE TABLE "_CustomFittedInventoryToInventory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CustomFittedInventoryToInventory_AB_unique" ON "_CustomFittedInventoryToInventory"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomFittedInventoryToInventory_B_index" ON "_CustomFittedInventoryToInventory"("B");

-- AddForeignKey
ALTER TABLE "_CustomFittedInventoryToInventory" ADD CONSTRAINT "_CustomFittedInventoryToInventory_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomFittedInventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomFittedInventoryToInventory" ADD CONSTRAINT "_CustomFittedInventoryToInventory_B_fkey" FOREIGN KEY ("B") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
