/*
  Warnings:

  - You are about to drop the column `emailExpirationTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailOtp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `newemail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneExpirationTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneOtp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailExpirationTime",
DROP COLUMN "emailOtp",
DROP COLUMN "newemail",
DROP COLUMN "phoneExpirationTime",
DROP COLUMN "phoneOtp";

-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "emailOtp" TEXT,
    "emailExpirationTime" TIMESTAMP(3),
    "phoneOtp" TEXT,
    "phoneExpirationTime" TIMESTAMP(3),
    "newEmail" TEXT,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_userId_key" ON "UserAuthentication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_newEmail_key" ON "UserAuthentication"("newEmail");

-- AddForeignKey
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
