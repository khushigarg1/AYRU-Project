/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `Color` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "inventoryId";
