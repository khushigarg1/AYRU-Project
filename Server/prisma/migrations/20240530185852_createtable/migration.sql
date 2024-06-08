/*
  Warnings:

  - You are about to drop the column `userId` on the `UserAuthentication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "UserAuthentication_userId_fkey";

-- DropIndex
DROP INDEX "UserAuthentication_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userAuthenticationId" INTEGER;

-- AlterTable
ALTER TABLE "UserAuthentication" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userAuthenticationId_fkey" FOREIGN KEY ("userAuthenticationId") REFERENCES "UserAuthentication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
