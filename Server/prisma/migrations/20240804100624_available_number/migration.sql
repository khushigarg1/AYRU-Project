/*
  Warnings:

  - Added the required column `mobilenumber` to the `AvailabilityRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailabilityRequest" ADD COLUMN     "mobilenumber" TEXT NOT NULL;
