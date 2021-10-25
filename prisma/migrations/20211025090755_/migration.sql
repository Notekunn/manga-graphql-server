-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatarURL` VARCHAR(191),
    `role` ENUM('MEMBER', 'MODERATOR', 'ADMINISTRATOR') NOT NULL DEFAULT 'MEMBER',

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `about` VARCHAR(191),
    `avatarURL` VARCHAR(191),

    UNIQUE INDEX `Artist_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_member` (
    `groupId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `role` ENUM('MEMBER', 'MODERATOR') NOT NULL DEFAULT 'MEMBER',
    `participantAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`groupId`, `memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `otherName` VARCHAR(191),
    `description` VARCHAR(191),
    `status` ENUM('CANCELLED', 'DROPPED', 'ONGOING', 'COMPLETED') NOT NULL DEFAULT 'ONGOING',
    `coverURL` VARCHAR(191),
    `releaseYear` VARCHAR(191),
    `lastUpdated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `artistId` INTEGER NOT NULL,

    UNIQUE INDEX `Manga_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_manga` (
    `mangaId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`mangaId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_manga` (
    `mangaId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`mangaId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chapterName` VARCHAR(191) NOT NULL,
    `mangaId` INTEGER NOT NULL,
    `chapterFullName` VARCHAR(191),
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `lastUpdated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `content` TEXT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `view_count` (
    `chapterName` VARCHAR(191) NOT NULL,
    `mangaId` INTEGER NOT NULL,
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `view` INTEGER NOT NULL,

    PRIMARY KEY (`chapterName`, `mangaId`, `date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `group_member` ADD CONSTRAINT `group_member_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_member` ADD CONSTRAINT `group_member_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_manga` ADD CONSTRAINT `category_manga_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_manga` ADD CONSTRAINT `category_manga_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_manga` ADD CONSTRAINT `group_manga_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_manga` ADD CONSTRAINT `group_manga_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
