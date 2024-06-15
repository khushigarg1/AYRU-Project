-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "inventoryId" INTEGER;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "skuId" DROP NOT NULL,
ALTER COLUMN "productName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
