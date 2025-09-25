/*
  Warnings:

  - You are about to drop the column `originalName` on the `File` table. All the data in the column will be lost.
  - Added the required column `originalname` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "originalName",
ADD COLUMN     "originalname" TEXT NOT NULL;
