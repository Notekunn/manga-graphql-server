/*
  Warnings:

  - Added the required column `mangaId` to the `view_count` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `view_count` ADD COLUMN `mangaId` INTEGER NOT NULL;
