-- Migration: 000000_init
-- Create users, chats, messages tables for ShotaProjectWeb

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chats` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME(6) NOT NULL,
  INDEX `idx_chats_userId` (`userId`),
  CONSTRAINT `fk_chats_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `chatId` VARCHAR(64) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `content` LONGTEXT,
  `timestamp` DATETIME(6) NOT NULL,
  INDEX `idx_messages_chatId` (`chatId`),
  CONSTRAINT `fk_messages_chat` FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
