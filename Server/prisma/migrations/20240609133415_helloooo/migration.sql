/*
  Warnings:

  - You are about to drop the column `inventoryFittedId` on the `FittedDimensions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FittedDimensions" DROP CONSTRAINT "FittedDimensions_inventoryFittedId_fkey";

-- AlterTable
ALTER TABLE "FittedDimensions" DROP COLUMN "inventoryFittedId";

-- CreateTable
CREATE TABLE "_FittedDimensionsToInventoryFitted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FittedDimensionsToInventoryFitted_AB_unique" ON "_FittedDimensionsToInventoryFitted"("A", "B");

-- CreateIndex
CREATE INDEX "_FittedDimensionsToInventoryFitted_B_index" ON "_FittedDimensionsToInventoryFitted"("B");

-- AddForeignKey
ALTER TABLE "_FittedDimensionsToInventoryFitted" ADD CONSTRAINT "_FittedDimensionsToInventoryFitted_A_fkey" FOREIGN KEY ("A") REFERENCES "FittedDimensions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FittedDimensionsToInventoryFitted" ADD CONSTRAINT "_FittedDimensionsToInventoryFitted_B_fkey" FOREIGN KEY ("B") REFERENCES "InventoryFitted"("id") ON DELETE CASCADE ON UPDATE CASCADE;
