/*
  Warnings:

  - Made the column `name` on table `Upload` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Upload" ALTER COLUMN "name" SET NOT NULL;
