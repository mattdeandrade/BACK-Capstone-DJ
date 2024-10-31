/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the `_TrackPlaylists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Edit" DROP CONSTRAINT "Edit_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_TrackPlaylists" DROP CONSTRAINT "_TrackPlaylists_A_fkey";

-- DropForeignKey
ALTER TABLE "_TrackPlaylists" DROP CONSTRAINT "_TrackPlaylists_B_fkey";

-- AlterTable
ALTER TABLE "Edit" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "playlistId" INTEGER;

-- DropTable
DROP TABLE "_TrackPlaylists";

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edit" ADD CONSTRAINT "Edit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
