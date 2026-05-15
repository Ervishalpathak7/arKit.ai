/*
  Warnings:

  - You are about to drop the column `description` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `techStack` on the `Design` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `Design` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "description",
DROP COLUMN "techStack",
ADD COLUMN     "prompt" TEXT NOT NULL;
