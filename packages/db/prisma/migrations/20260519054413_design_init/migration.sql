/*
  Warnings:

  - Added the required column `updatedAt` to the `Design` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "DesignStatus" NOT NULL DEFAULT 'PROCESSING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
