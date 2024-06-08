/*
  Warnings:

  - You are about to drop the column `fittedId` on the `CustomFittedInventory` table. All the data in the column will be lost.
  - Added the required column `customFittedId` to the `CustomFittedInventory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropForeignKey
ALTER TABLE "CustomFittedInventory" DROP CONSTRAINT "CustomFittedInventory_fittedId_fkey";

-- AlterTable
ALTER TABLE "CustomFittedInventory" DROP COLUMN "fittedId",
ADD COLUMN     "customFittedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "productstatus" "ProductStatus";

-- AddForeignKey
ALTER TABLE "CustomFittedInventory" ADD CONSTRAINT "CustomFittedInventory_customFittedId_fkey" FOREIGN KEY ("customFittedId") REFERENCES "CustomFitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
