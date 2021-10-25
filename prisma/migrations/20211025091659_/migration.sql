/*
  Warnings:

  - The primary key for the `view_count` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chapterName` on the `view_count` table. All the data in the column will be lost.
  - You are about to drop the column `mangaId` on the `view_count` table. All the data in the column will be lost.
  - Added the required column `chapterId` to the `view_count` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `view_count` DROP PRIMARY KEY,
    DROP COLUMN `chapterName`,
    DROP COLUMN `mangaId`,
    ADD COLUMN `chapterId` INTEGER NOT NULL,
    MODIFY `view` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`chapterId`, `date`);
