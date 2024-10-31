/*
  Warnings:

  - You are about to drop the column `tempo` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `trackInstrumental` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `trackVocals` on the `Edit` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `voc` on the `Track` table. All the data in the column will be lost.
  - Added the required column `artistName` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bpm` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrumental` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackName` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vocals` to the `Edit` table without a default value. This is not possible if the table is not empty.
  - Made the column `pitch` on table `Edit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `effects` on table `Edit` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vocals` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duration` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Edit" DROP CONSTRAINT "Edit_trackId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_userId_fkey";

-- AlterTable
ALTER TABLE "Edit" DROP COLUMN "tempo",
DROP COLUMN "time",
DROP COLUMN "trackId",
DROP COLUMN "trackInstrumental",
DROP COLUMN "trackVocals",
ADD COLUMN     "artistName" TEXT NOT NULL,
ADD COLUMN     "audioDataUrl" TEXT,
ADD COLUMN     "bitrate" INTEGER NOT NULL DEFAULT 320,
ADD COLUMN     "bpm" INTEGER NOT NULL,
ADD COLUMN     "channelmode" TEXT NOT NULL DEFAULT 'stereo',
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "instrumental" BOOLEAN NOT NULL,
ADD COLUMN     "samplingrate" INTEGER NOT NULL DEFAULT 44100,
ADD COLUMN     "trackName" TEXT NOT NULL,
ADD COLUMN     "vocals" BOOLEAN NOT NULL,
ALTER COLUMN "pitch" SET NOT NULL,
ALTER COLUMN "effects" SET NOT NULL;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "time",
DROP COLUMN "voc",
ADD COLUMN     "audioDataUrl" TEXT,
ADD COLUMN     "bitrate" INTEGER NOT NULL DEFAULT 320,
ADD COLUMN     "channelmode" TEXT NOT NULL DEFAULT 'stereo',
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "samplingrate" INTEGER NOT NULL DEFAULT 44100,
ADD COLUMN     "vocals" BOOLEAN NOT NULL,
ALTER COLUMN "albumName" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "audioDataUrl" TEXT,
ADD COLUMN     "bitrate" INTEGER NOT NULL DEFAULT 320,
ADD COLUMN     "channelmode" TEXT NOT NULL DEFAULT 'stereo',
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "samplingrate" INTEGER NOT NULL DEFAULT 44100;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
