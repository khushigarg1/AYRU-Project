-- CreateTable
CREATE TABLE "AvailabilityRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "inventoryid" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilityRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AvailabilityRequest" ADD CONSTRAINT "AvailabilityRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRequest" ADD CONSTRAINT "AvailabilityRequest_inventoryid_fkey" FOREIGN KEY ("inventoryid") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
