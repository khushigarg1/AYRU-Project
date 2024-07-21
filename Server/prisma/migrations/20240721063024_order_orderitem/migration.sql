/*
  Warnings:

  - You are about to drop the column `couriername` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageurl` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `trekkingId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `trekkingid` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "couriername" TEXT,
ADD COLUMN     "imageurl" TEXT,
ADD COLUMN     "trekkingId1" TEXT,
ADD COLUMN     "trekkingId2" TEXT,
ADD COLUMN     "trekkinglink" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "couriername",
DROP COLUMN "dimensions",
DROP COLUMN "imageurl",
DROP COLUMN "trekkingId",
DROP COLUMN "trekkingid";
