-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'MAX');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "credit" INTEGER NOT NULL DEFAULT 5
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
