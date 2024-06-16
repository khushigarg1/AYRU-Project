/*
  Warnings:

  - You are about to drop the `_FittedDimensionsToInventoryFitted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FittedDimensionsToInventoryFitted" DROP CONSTRAINT "_FittedDimensionsToInventoryFitted_A_fkey";

-- DropForeignKey
ALTER TABLE "_FittedDimensionsToInventoryFitted" DROP CONSTRAINT "_FittedDimensionsToInventoryFitted_B_fkey";

-- DropTable
DROP TABLE "_FittedDimensionsToInventoryFitted";

-- CreateTable
CREATE TABLE "_InventoryFittedToFittedDimensions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryFittedToFittedDimensions_AB_unique" ON "_InventoryFittedToFittedDimensions"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryFittedToFittedDimensions_B_index" ON "_InventoryFittedToFittedDimensions"("B");

-- AddForeignKey
ALTER TABLE "_InventoryFittedToFittedDimensions" ADD CONSTRAINT "_InventoryFittedToFittedDimensions_A_fkey" FOREIGN KEY ("A") REFERENCES "FittedDimensions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryFittedToFittedDimensions" ADD CONSTRAINT "_InventoryFittedToFittedDimensions_B_fkey" FOREIGN KEY ("B") REFERENCES "InventoryFitted"("id") ON DELETE CASCADE ON UPDATE CASCADE;
