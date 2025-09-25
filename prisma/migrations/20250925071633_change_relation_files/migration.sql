/*
  Warnings:

  - You are about to drop the `FilesOnFolders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FilesOnFolders" DROP CONSTRAINT "FilesOnFolders_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FilesOnFolders" DROP CONSTRAINT "FilesOnFolders_folderId_fkey";

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "folderId" INTEGER;

-- DropTable
DROP TABLE "public"."FilesOnFolders";

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
