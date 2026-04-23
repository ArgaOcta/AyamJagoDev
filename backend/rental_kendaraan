-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for rental_kendaraan
CREATE DATABASE IF NOT EXISTS `rental_kendaraan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rental_kendaraan`;

-- Dumping structure for table rental_kendaraan.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `booking_status` enum('pending','paid','active','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rental_kendaraan.bookings: ~3 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `vehicle_id`, `start_date`, `end_date`, `total_days`, `total_price`, `booking_status`, `created_at`) VALUES
	(1, 1, 1, '2026-04-10', '2026-04-12', 2, 600000.00, 'pending', '2026-04-07 05:47:14'),
	(2, 1, 1, '2026-04-10', '2026-04-12', 2, 600000.00, 'pending', '2026-04-15 01:32:33'),
	(3, 1, 1, '2026-04-15', '2026-04-30', 15, 4500000.00, 'pending', '2026-04-15 02:04:20');

-- Dumping structure for table rental_kendaraan.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','success','failed') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rental_kendaraan.payments: ~3 rows (approximately)
INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `payment_date`, `payment_status`) VALUES
	(1, 1, 'Transfer Bank', 600000.00, '2026-04-07 05:47:14', 'pending'),
	(2, 2, 'Transfer Bank', 600000.00, '2026-04-15 01:32:33', 'pending'),
	(3, 3, 'Cash on Delivery', 4500000.00, '2026-04-15 02:04:20', 'pending');

-- Dumping structure for table rental_kendaraan.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rental_kendaraan.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
	(1, 'bilal', 'bilal@email.com', '123', 'user', '2026-04-07 05:42:23'),
	(2, 'Muhamad Bilal', 'bilal123@ayamjago.dev', '$2b$10$0L85EFvqzgvzmWTl87Wzi.h.4Gy/AzVkHoinxlppBWK5qIu21ZsA.', 'user', '2026-04-21 11:51:51');

-- Dumping structure for table rental_kendaraan.vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `category` enum('mobil','motor') NOT NULL,
  `price_per_day` decimal(12,2) NOT NULL,
  `status` enum('tersedia','disewa','maintenance') DEFAULT 'tersedia',
  `image_url` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_plate` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rental_kendaraan.vehicles: ~0 rows (approximately)
INSERT INTO `vehicles` (`id`, `brand`, `model`, `license_plate`, `category`, `price_per_day`, `status`, `image_url`, `description`, `created_at`) VALUES
	(1, 'Toyota', 'Avanza', 'B 1234 XYZ', 'mobil', 300000.00, 'tersedia', NULL, NULL, '2026-04-07 05:42:36');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
