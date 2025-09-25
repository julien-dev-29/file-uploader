/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_userId_fkey";

-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "userId";
