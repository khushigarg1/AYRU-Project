/*
  Warnings:

  - The `itemDimensions` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Fitted` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "itemDimensions",
ADD COLUMN     "itemDimensions" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Fitted_name_key" ON "Fitted"("name");
