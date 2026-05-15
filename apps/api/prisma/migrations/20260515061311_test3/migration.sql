-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "status" "DesignStatus" NOT NULL DEFAULT 'PROCESSING';
