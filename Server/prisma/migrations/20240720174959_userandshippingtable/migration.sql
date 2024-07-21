/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "alternateMobileNumber" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "alternateMobileNumber" TEXT;
