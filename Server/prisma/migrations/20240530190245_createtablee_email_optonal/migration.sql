/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserAuthentication` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserAuthentication_newEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_email_key" ON "UserAuthentication"("email");
