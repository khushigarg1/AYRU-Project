-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "emailVerificationOtp" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
