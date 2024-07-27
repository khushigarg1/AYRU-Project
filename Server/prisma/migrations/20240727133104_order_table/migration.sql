-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "costPrice" TEXT,
ADD COLUMN     "discountedPrice" TEXT,
ADD COLUMN     "sellingPrice" TEXT;

-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "userName" TEXT;
