/*
  Warnings:

  - You are about to drop the column `images` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "images",
DROP COLUMN "video";

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
