/*
  Warnings:

  - Made the column `skuId` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productName` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "skuId" SET NOT NULL,
ALTER COLUMN "productName" SET NOT NULL;
