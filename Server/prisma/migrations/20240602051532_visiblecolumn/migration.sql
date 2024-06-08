-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "visible" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
