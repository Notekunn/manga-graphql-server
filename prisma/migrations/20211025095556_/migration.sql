/*
  Warnings:

  - The primary key for the `view_count` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `view_count` DROP PRIMARY KEY,
    MODIFY `date` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`chapterId`, `date`);
