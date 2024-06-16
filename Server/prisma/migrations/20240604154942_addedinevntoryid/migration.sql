/*
  Warnings:

  - You are about to drop the column `name` on the `CustomFittedInventory` table. All the data in the column will be lost.
  - You are about to drop the `_CustomFittedInventoryToInventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fittedId` to the `CustomFittedInventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryId` to the `CustomFittedInventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CustomFittedInventoryToInventory" DROP CONSTRAINT "_CustomFittedInventoryToInventory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomFittedInventoryToInventory" DROP CONSTRAINT "_CustomFittedInventoryToInventory_B_fkey";

-- AlterTable
ALTER TABLE "CustomFittedInventory" DROP COLUMN "name",
ADD COLUMN     "fittedId" INTEGER NOT NULL,
ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CustomFittedInventoryToInventory";

-- CreateTable
CREATE TABLE "CustomFitted" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CustomFitted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomFittedInventory" ADD CONSTRAINT "CustomFittedInventory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFittedInventory" ADD CONSTRAINT "CustomFittedInventory_fittedId_fkey" FOREIGN KEY ("fittedId") REFERENCES "Fitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
