/*
  Warnings:

  - You are about to drop the column `sale` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "sale" BOOLEAN;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sale";
