/*
  Warnings:

  - The `costPrice` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `discountedPrice` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sellingPrice` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "costPrice",
ADD COLUMN     "costPrice" DOUBLE PRECISION,
DROP COLUMN "discountedPrice",
ADD COLUMN     "discountedPrice" DOUBLE PRECISION,
DROP COLUMN "sellingPrice",
ADD COLUMN     "sellingPrice" DOUBLE PRECISION;
