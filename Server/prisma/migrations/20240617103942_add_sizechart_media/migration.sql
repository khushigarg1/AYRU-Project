-- CreateTable
CREATE TABLE "SizeChartMedia" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeChartMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SizeChartMedia" ADD CONSTRAINT "SizeChartMedia_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
