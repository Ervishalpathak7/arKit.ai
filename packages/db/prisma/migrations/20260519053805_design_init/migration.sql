-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "body" JSONB,
    "authorId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);
