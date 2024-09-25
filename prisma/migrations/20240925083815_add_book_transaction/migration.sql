-- CreateTable
CREATE TABLE `book_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `book_id` INTEGER NOT NULL,
    `borrow_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `return_date` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'borrowed',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
