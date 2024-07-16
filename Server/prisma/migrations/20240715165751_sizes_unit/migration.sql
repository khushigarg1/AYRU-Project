/*
  Warnings:

  - You are about to drop the column `sizeName` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `sizeType` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `sizeName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sizeType` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "sizeName",
DROP COLUMN "sizeType",
ADD COLUMN     "selectedCustomFittedItem" TEXT,
ADD COLUMN     "selectedFittedItem" TEXT,
ADD COLUMN     "selectedFlatItem" TEXT,
ADD COLUMN     "sizeOption" TEXT,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sizeName",
DROP COLUMN "sizeType",
ADD COLUMN     "selectedCustomFittedItem" TEXT,
ADD COLUMN     "selectedFittedItem" TEXT,
ADD COLUMN     "selectedFlatItem" TEXT,
ADD COLUMN     "sizeOption" TEXT,
ADD COLUMN     "unit" TEXT;
