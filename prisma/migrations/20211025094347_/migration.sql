-- AddForeignKey
ALTER TABLE `view_count` ADD CONSTRAINT `view_count_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
