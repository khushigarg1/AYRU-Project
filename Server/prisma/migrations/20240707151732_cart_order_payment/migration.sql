/*
  Warnings:

  - You are about to drop the column `orderID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `cardNumber` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `cardholderName` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `trekkingId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `inventoryId` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `deliveryAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `inventoryId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `accountNumber` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expiryDate` on the `PaymentMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `pincode` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayOrderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayPaymentId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `inventoryId` on table `Wishlist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingAddress" DROP CONSTRAINT "ShippingAddress_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_inventoryId_fkey";

-- DropIndex
DROP INDEX "Cart_userId_inventoryId_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "sizeName" TEXT,
ADD COLUMN     "sizeType" TEXT,
ADD COLUMN     "width" DOUBLE PRECISION,
ALTER COLUMN "inventoryId" SET NOT NULL,
ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderID",
ADD COLUMN     "deliveryAddressId" INTEGER NOT NULL,
ADD COLUMN     "deliveryStatus" TEXT NOT NULL,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "paymentMethodId" INTEGER NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "sizeName" TEXT,
ADD COLUMN     "sizeType" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION,
ALTER COLUMN "trekkingId" SET DATA TYPE TEXT,
ALTER COLUMN "inventoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "billingAddress",
DROP COLUMN "cardNumber",
DROP COLUMN "cardholderName",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "expiryDate",
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "orderId",
DROP COLUMN "postalCode",
DROP COLUMN "productId",
DROP COLUMN "trekkingId",
ADD COLUMN     "pincode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "orderId",
ADD COLUMN     "bank" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "razorpayOrderId" TEXT NOT NULL,
ADD COLUMN     "razorpayPaymentId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "transactionDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Wishlist" ALTER COLUMN "inventoryId" SET NOT NULL;

-- DropTable
DROP TABLE "OrderItem";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "ShippingAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
