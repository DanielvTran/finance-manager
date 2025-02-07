-- DropForeignKey
ALTER TABLE `Budget` DROP FOREIGN KEY `Budget_userId_fkey`;

-- DropIndex
DROP INDEX `Budget_userId_fkey` ON `Budget`;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
