/*
  Warnings:

  - You are about to drop the column `trackName` on the `Edit` table. All the data in the column will be lost.
  - Added the required column `editName` to the `Edit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edit" DROP COLUMN "trackName",
ADD COLUMN     "editName" TEXT NOT NULL;
