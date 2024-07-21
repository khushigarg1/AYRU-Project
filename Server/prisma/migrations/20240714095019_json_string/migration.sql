/*
  Warnings:

  - The `includedItems` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialFeatures` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "includedItems",
ADD COLUMN     "includedItems" TEXT[],
DROP COLUMN "specialFeatures",
ADD COLUMN     "specialFeatures" TEXT[];
