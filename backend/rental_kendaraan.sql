-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: rental_kendaraan
-- ------------------------------------------------------
-- Server version	8.0.46

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
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

LOCK TABLES `bookings` WRITE; 
INSERT INTO `bookings` VALUES (1,1,1,'2026-04-10','2026-04-12',2,600000.00,'pending','2026-04-07 05:47:14'),(2,1,1,'2026-04-10','2026-04-12',2,600000.00,'pending','2026-04-15 01:32:33'),(3,1,1,'2026-04-15','2026-04-30',15,4500000.00,'pending','2026-04-15 02:04:20');
UNLOCK TABLES; 

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
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

LOCK TABLES `payments` WRITE;
INSERT INTO `payments` VALUES (1,1,'Transfer Bank',600000.00,'2026-04-07 05:47:14','pending'),(2,2,'Transfer Bank',600000.00,'2026-04-15 01:32:33','pending'),(3,3,'Cash on Delivery',4500000.00,'2026-04-15 02:04:20','pending');
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar_url` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'bilal','bilal@email.com','123','user','2026-04-07 05:42:23',NULL),(2,'Muhamad Bilal','bilal123@ayamjago.dev','$2b$10$0L85EFvqzgvzmWTl87Wzi.h.4Gy/AzVkHoinxlppBWK5qIu21ZsA.','user','2026-04-21 11:51:51',NULL),(3,'ARGA','arga123@gmail.com','$2b$10$H8R53pEMeKNcYOLMxgIVtu11FDHtUE06KhoU6LT4YsT7MHqSBXQtC','user','2026-06-10 01:47:23',NULL),(4,'AsepBensin','asepbensin890@gmail.com','$2b$10$YsENVc.3pF6RRDN4HqgOr.tPdW9/.Q4TL6rFtrMa1DIuojG28WE1i','user','2026-06-10 01:51:19','blob:http://localhost:5173/0fa10691-b3ee-444c-a256-4ff67eadae0d'),(6,'Jay','jay123@gmail.com','$2b$10$mqIkuFtWQg/rxJ0Ywv.l1eRYLCdyLrPF1pRF4cZrAYTmylHW4lrRi','admin','2026-06-10 07:07:26',NULL),(7,'Bili','biligunawan123@gmail.com','$2b$10$aRIbv7tV7M1lgpKw7z0qtOulj7hOXoaGMldFRqf1HQMvenzpNPe7a','user','2026-06-11 06:36:10',NULL);
UNLOCK TABLES;

DROP TABLE IF EXISTS `vehicles`;

CREATE TABLE `vehicles` (
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

LOCK TABLES `vehicles` WRITE;
INSERT INTO `vehicles` VALUES (1,'Toyota','Avanza','B 1234 XYZ','mobil',300000.00,'tersedia',NULL,NULL,'2026-04-07 05:42:36');
UNLOCK TABLES;
