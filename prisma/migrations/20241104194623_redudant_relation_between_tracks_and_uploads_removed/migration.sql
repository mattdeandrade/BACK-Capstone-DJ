/*
  Warnings:

  - You are about to drop the column `trackId` on the `Upload` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_trackId_fkey";

-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "trackId";
