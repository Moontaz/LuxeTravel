-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3310
-- Generation Time: Oct 31, 2024 at 02:48 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: bus_ticketing
--

-- --------------------------------------------------------

--
-- Table structure for table buses
--

CREATE TABLE buses (
  bus_id int NOT NULL,
  bus_name varchar(255) DEFAULT NULL,
  route_id int DEFAULT NULL,
  departure_time timestamp NOT NULL,
  price int NOT NULL,
  seat_capacity int NOT NULL,
  available_seats int NOT NULL
) ;

--
-- Dumping data for table buses
--

INSERT INTO buses (bus_id, bus_name, route_id, departure_time, price, seat_capacity, available_seats) VALUES
(1, 'Damri', 32, '2024-09-23 08:15:00', 67268, 40, 40),
(2, 'Gunung Harta', 25, '2024-09-22 12:45:00', 60485, 40, 40),
(3, 'Safari Dharma Raya', 11, '2024-09-22 11:35:00', 30000, 40, 39),
(4, 'Safari Dharma Raya', 8, '2024-09-24 09:30:00', 60000, 40, 40),
(5, 'Harapan Jaya', 14, '2024-09-24 09:20:00', 40000, 40, 40),
(6, 'Gunung Harta', 27, '2024-09-22 08:55:00', 30000, 40, 40),
(7, 'Gunung Harta', 31, '2024-09-22 12:00:00', 60000, 40, 40),
(8, 'Harapan Jaya', 36, '2024-09-23 11:05:00', 70000, 40, 40),
(9, 'Lorena', 34, '2024-09-24 14:05:00', 50000, 40, 40),
(10, 'Pahala Kencana', 24, '2024-09-24 11:10:00', 30000, 40, 40),
(11, 'Lorena', 17, '2024-09-22 14:55:00', 50000, 40, 40),
(12, 'Pahala Kencana', 32, '2024-09-23 12:15:00', 30000, 40, 40),
(13, 'Rosalia Indah', 20, '2024-09-24 08:45:00', 30000, 40, 40),
(14, 'Lorena', 15, '2024-09-22 10:40:00', 30000, 40, 40),
(15, 'Lorena', 3, '2024-09-22 10:50:00', 30000, 40, 40),
(16, 'Damri', 5, '2024-09-23 08:45:00', 70000, 40, 40),
(17, 'Safari Dharma Raya', 28, '2024-09-23 09:30:00', 30000, 40, 40),
(18, 'Safari Dharma Raya', 30, '2024-09-23 10:00:00', 50000, 40, 40),
(19, 'Harapan Jaya', 33, '2024-09-22 11:45:00', 40000, 40, 40),
(20, 'Damri', 25, '2024-09-24 11:35:00', 40000, 40, 40),
(21, 'Sinar Jaya', 12, '2024-09-22 12:20:00', 60000, 40, 40),
(22, 'Safari Dharma Raya', 10, '2024-09-22 08:25:00', 40000, 40, 40),
(23, 'Mitra Rahayu', 7, '2024-09-22 12:10:00', 70000, 40, 40),
(24, 'Damri', 23, '2024-09-24 08:50:00', 30000, 40, 40),
(25, 'Mitra Rahayu', 16, '2024-09-23 08:15:00', 30000, 40, 39),
(26, 'Lorena', 26, '2024-09-22 12:00:00', 50000, 40, 40),
(27, 'Sinar Jaya', 9, '2024-09-23 13:45:00', 50000, 40, 40),
(28, 'Gunung Harta', 6, '2024-09-22 10:20:00', 30000, 40, 40),
(29, 'Harapan Jaya', 1, '2024-09-22 12:45:00', 30000, 40, 28),
(30, 'Pahala Kencana', 2, '2024-09-24 11:45:00', 30000, 40, 40),
(31, 'Lorena', 35, '2024-09-24 14:35:00', 60000, 40, 40),
(32, 'Mitra Rahayu', 19, '2024-09-24 08:15:00', 30000, 40, 40),
(33, 'Pahala Kencana', 21, '2024-09-23 12:30:00', 40000, 40, 39),
(34, 'Harapan Jaya', 13, '2024-09-23 12:50:00', 50000, 40, 40),
(35, 'Safari Dharma Raya', 29, '2024-09-24 10:15:00', 40000, 40, 40),
(36, 'Harapan Jaya', 4, '2024-09-23 14:40:00', 60000, 40, 40),
(37, 'Sinar Jaya', 18, '2024-09-23 12:30:00', 40000, 40, 40),
(38, 'Mitra Rahayu', 22, '2024-09-23 10:15:00', 40000, 40, 40),
(66, 'Safari Dharma Raya', 14, '2024-09-22 09:45:00', 40000, 40, 40),
(67, 'Mitra Rahayu', 34, '2024-09-22 12:35:00', 50000, 40, 40),
(68, 'Harapan Jaya', 11, '2024-09-24 14:05:00', 30000, 40, 40),
(69, 'Gunung Harta', 36, '2024-09-22 08:15:00', 70000, 40, 40),
(70, 'Gunung Harta', 25, '2024-09-24 14:05:00', 40000, 40, 40),
(71, 'Primajasa', 13, '2024-09-22 08:00:00', 50000, 40, 40),
(72, 'Damri', 31, '2024-09-22 11:20:00', 60000, 40, 40),
(73, 'Harapan Jaya', 17, '2024-09-23 12:30:00', 50000, 40, 40),
(74, 'Lorena', 29, '2024-09-24 13:20:00', 40000, 40, 40),
(75, 'Primajasa', 9, '2024-09-24 10:30:00', 50000, 40, 40),
(76, 'Gunung Harta', 28, '2024-09-22 09:45:00', 30000, 40, 40),
(77, 'Gunung Harta', 20, '2024-09-22 11:00:00', 30000, 40, 40),
(78, 'Damri', 15, '2024-09-23 09:10:00', 30000, 40, 40),
(79, 'Harapan Jaya', 23, '2024-09-22 09:45:00', 30000, 40, 40),
(80, 'Primajasa', 27, '2024-09-24 12:00:00', 30000, 40, 40),
(81, 'Pahala Kencana', 10, '2024-09-23 12:45:00', 40000, 40, 40),
(82, 'Rosalia Indah', 24, '2024-09-23 14:20:00', 30000, 40, 40),
(83, 'Lorena', 16, '2024-09-24 13:55:00', 30000, 40, 40),
(84, 'Damri', 8, '2024-09-22 09:05:00', 60000, 40, 40),
(85, 'Safari Dharma Raya', 19, '2024-09-24 10:40:00', 30000, 40, 40),
(86, 'Rosalia Indah', 2, '2024-09-22 09:50:00', 30000, 40, 40),
(87, 'Lorena', 32, '2024-09-24 13:35:00', 30000, 40, 40),
(88, 'Damri', 22, '2024-09-22 11:55:00', 40000, 40, 40),
(89, 'Harapan Jaya', 4, '2024-09-23 08:45:00', 60000, 40, 40),
(90, 'Damri', 26, '2024-09-23 08:20:00', 50000, 40, 39),
(91, 'Harapan Jaya', 3, '2024-09-24 08:45:00', 30000, 40, 40),
(92, 'Lorena', 5, '2024-09-24 08:45:00', 70000, 40, 40),
(93, 'Mitra Rahayu', 33, '2024-09-23 08:35:00', 40000, 40, 40),
(94, 'Safari Dharma Raya', 6, '2024-09-24 14:30:00', 30000, 40, 40),
(95, 'Harapan Jaya', 21, '2024-09-24 08:30:00', 40000, 40, 40),
(96, 'Pahala Kencana', 1, '2024-09-22 10:20:00', 30000, 40, 40),
(97, 'Sinar Jaya', 30, '2024-09-22 09:45:00', 50000, 40, 40),
(98, 'Harapan Jaya', 12, '2024-09-24 12:30:00', 60000, 40, 40),
(99, 'Rosalia Indah', 18, '2024-09-22 11:10:00', 40000, 40, 40),
(100, 'Rosalia Indah', 35, '2024-09-24 10:00:00', 60000, 40, 40),
(101, 'Mitra Rahayu', 7, '2024-09-22 11:00:00', 70000, 40, 40),
(129, 'Lorena', 10, '2024-09-22 08:40:00', 40000, 40, 40),
(130, 'Pahala Kencana', 34, '2024-09-22 14:35:00', 50000, 40, 40),
(131, 'Rosalia Indah', 22, '2024-09-22 09:00:00', 40000, 40, 40),
(132, 'Rosalia Indah', 14, '2024-09-23 12:50:00', 40000, 40, 40),
(133, 'Sinar Jaya', 5, '2024-09-24 09:15:00', 70000, 40, 40),
(134, 'Rosalia Indah', 31, '2024-09-24 10:55:00', 60000, 40, 40),
(135, 'Gunung Harta', 13, '2024-09-23 10:00:00', 50000, 40, 40),
(136, 'Damri', 29, '2024-09-22 09:00:00', 40000, 40, 40),
(137, 'Gunung Harta', 19, '2024-09-23 12:55:00', 30000, 40, 40),
(138, 'Rosalia Indah', 4, '2024-09-24 12:55:00', 60000, 40, 40),
(139, 'Sinar Jaya', 21, '2024-09-23 10:00:00', 40000, 40, 40),
(140, 'Gunung Harta', 3, '2024-09-22 13:50:00', 30000, 40, 40),
(141, 'Primajasa', 16, '2024-09-22 12:15:00', 30000, 40, 40),
(142, 'Lorena', 8, '2024-09-24 09:35:00', 60000, 40, 40),
(143, 'Gunung Harta', 36, '2024-09-24 14:55:00', 70000, 40, 40),
(144, 'Damri', 35, '2024-09-22 14:15:00', 60000, 40, 40),
(145, 'Lorena', 15, '2024-09-22 10:40:00', 30000, 40, 40),
(146, 'Sinar Jaya', 30, '2024-09-23 12:45:00', 50000, 40, 40),
(147, 'Pahala Kencana', 17, '2024-09-23 08:20:00', 50000, 40, 40),
(148, 'Damri', 11, '2024-09-23 11:40:00', 30000, 40, 40),
(149, 'Rosalia Indah', 9, '2024-09-22 12:45:00', 50000, 40, 40),
(150, 'Gunung Harta', 7, '2024-09-23 11:05:00', 70000, 40, 40),
(151, 'Lorena', 32, '2024-09-22 11:40:00', 30000, 40, 40),
(152, 'Safari Dharma Raya', 6, '2024-09-22 08:55:00', 30000, 40, 40),
(153, 'Safari Dharma Raya', 23, '2024-09-24 08:00:00', 30000, 40, 40),
(154, 'Primajasa', 25, '2024-09-23 09:40:00', 40000, 40, 40),
(155, 'Mitra Rahayu', 33, '2024-09-24 08:05:00', 40000, 40, 40),
(156, 'Pahala Kencana', 20, '2024-09-22 11:30:00', 30000, 40, 40),
(157, 'Damri', 18, '2024-09-24 11:55:00', 40000, 40, 40),
(158, 'Rosalia Indah', 28, '2024-09-22 12:35:00', 30000, 40, 40),
(159, 'Pahala Kencana', 12, '2024-09-24 11:55:00', 60000, 40, 40),
(160, 'Harapan Jaya', 2, '2024-09-23 09:50:00', 30000, 40, 40),
(161, 'Safari Dharma Raya', 24, '2024-09-22 10:20:00', 30000, 40, 40),
(162, 'Safari Dharma Raya', 27, '2024-09-22 12:30:00', 30000, 40, 40),
(163, 'Rosalia Indah', 26, '2024-09-24 10:00:00', 50000, 40, 40),
(164, 'Harapan Jaya', 1, '2024-09-23 13:50:00', 30000, 40, 40),
(192, 'Mitra Rahayu', 23, '2024-09-22 13:20:00', 30000, 40, 40),
(193, 'Safari Dharma Raya', 11, '2024-09-24 13:35:00', 30000, 40, 40),
(194, 'Rosalia Indah', 36, '2024-09-23 14:00:00', 70000, 40, 40),
(195, 'Pahala Kencana', 6, '2024-09-22 13:20:00', 30000, 40, 40),
(196, 'Rosalia Indah', 32, '2024-09-23 12:00:00', 30000, 40, 40),
(197, 'Gunung Harta', 13, '2024-09-22 10:55:00', 50000, 40, 40),
(198, 'Mitra Rahayu', 7, '2024-09-23 13:35:00', 70000, 40, 40),
(199, 'Pahala Kencana', 1, '2024-09-24 09:00:00', 30000, 40, 40),
(200, 'Sinar Jaya', 35, '2024-09-23 10:10:00', 60000, 40, 40),
(201, 'Pahala Kencana', 33, '2024-09-24 12:20:00', 40000, 40, 40),
(202, 'Harapan Jaya', 28, '2024-09-22 08:20:00', 30000, 40, 40),
(203, 'Rosalia Indah', 5, '2024-09-24 11:20:00', 70000, 40, 40),
(204, 'Damri', 30, '2024-09-23 14:15:00', 50000, 40, 40),
(205, 'Pahala Kencana', 16, '2024-09-22 14:30:00', 30000, 40, 40),
(206, 'Lorena', 14, '2024-09-24 08:10:00', 40000, 40, 40),
(207, 'Mitra Rahayu', 2, '2024-09-24 11:00:00', 30000, 40, 40),
(208, 'Primajasa', 15, '2024-09-22 08:55:00', 30000, 40, 40),
(209, 'Mitra Rahayu', 18, '2024-09-23 13:25:00', 40000, 40, 40),
(210, 'Rosalia Indah', 8, '2024-09-22 09:15:00', 60000, 40, 40),
(211, 'Pahala Kencana', 29, '2024-09-22 14:10:00', 40000, 40, 40),
(212, 'Primajasa', 3, '2024-09-24 09:40:00', 30000, 40, 40),
(213, 'Lorena', 27, '2024-09-23 10:15:00', 30000, 40, 40),
(214, 'Pahala Kencana', 12, '2024-09-24 14:35:00', 60000, 40, 40),
(215, 'Lorena', 9, '2024-09-22 13:40:00', 50000, 40, 40),
(216, 'Gunung Harta', 26, '2024-09-24 12:05:00', 50000, 40, 40),
(217, 'Lorena', 24, '2024-09-24 14:40:00', 30000, 40, 40),
(218, 'Lorena', 19, '2024-09-24 11:50:00', 30000, 40, 40),
(219, 'Mitra Rahayu', 25, '2024-09-23 10:45:00', 40000, 40, 40),
(220, 'Gunung Harta', 10, '2024-09-24 08:25:00', 40000, 40, 40),
(221, 'Lorena', 31, '2024-09-22 13:35:00', 60000, 40, 40),
(222, 'Safari Dharma Raya', 21, '2024-09-23 10:45:00', 40000, 40, 40),
(223, 'Sinar Jaya', 22, '2024-09-24 14:55:00', 40000, 40, 40),
(224, 'Safari Dharma Raya', 17, '2024-09-24 14:25:00', 50000, 40, 40),
(225, 'Lorena', 4, '2024-09-22 08:40:00', 60000, 40, 40),
(226, 'Sinar Jaya', 20, '2024-09-24 09:50:00', 30000, 40, 40),
(227, 'Safari Dharma Raya', 34, '2024-09-22 11:10:00', 50000, 40, 40),
(255, 'Damri', 3, '2024-09-24 11:35:00', 30000, 40, 40),
(256, 'Harapan Jaya', 35, '2024-09-22 12:35:00', 60000, 40, 40),
(257, 'Damri', 8, '2024-09-24 10:25:00', 60000, 40, 40),
(258, 'Gunung Harta', 16, '2024-09-24 08:35:00', 30000, 40, 40),
(259, 'Mitra Rahayu', 6, '2024-09-24 09:50:00', 30000, 40, 40),
(260, 'Lorena', 17, '2024-09-24 14:35:00', 50000, 40, 40),
(261, 'Lorena', 29, '2024-09-23 10:10:00', 40000, 40, 40),
(262, 'Harapan Jaya', 36, '2024-09-24 09:25:00', 70000, 40, 40),
(263, 'Pahala Kencana', 24, '2024-09-22 14:20:00', 30000, 40, 40),
(264, 'Primajasa', 34, '2024-09-22 10:00:00', 50000, 40, 40),
(265, 'Primajasa', 9, '2024-09-24 08:15:00', 50000, 40, 40),
(266, 'Primajasa', 33, '2024-09-24 11:40:00', 40000, 40, 40),
(267, 'Sinar Jaya', 22, '2024-09-24 12:55:00', 40000, 40, 40),
(268, 'Lorena', 10, '2024-09-23 10:05:00', 40000, 40, 40),
(269, 'Rosalia Indah', 18, '2024-09-24 08:40:00', 40000, 40, 40),
(270, 'Lorena', 31, '2024-09-23 09:20:00', 60000, 40, 40),
(271, 'Lorena', 5, '2024-09-22 11:05:00', 70000, 40, 40),
(272, 'Harapan Jaya', 25, '2024-09-24 08:55:00', 40000, 40, 40),
(273, 'Mitra Rahayu', 1, '2024-09-24 14:15:00', 30000, 40, 40),
(274, 'Mitra Rahayu', 19, '2024-09-24 11:35:00', 30000, 40, 40),
(275, 'Pahala Kencana', 14, '2024-09-22 09:10:00', 40000, 40, 40),
(276, 'Rosalia Indah', 32, '2024-09-22 13:10:00', 30000, 40, 40),
(277, 'Mitra Rahayu', 4, '2024-09-23 11:20:00', 60000, 40, 40),
(278, 'Pahala Kencana', 30, '2024-09-22 10:40:00', 50000, 40, 40),
(279, 'Gunung Harta', 21, '2024-09-23 11:05:00', 40000, 40, 40),
(280, 'Mitra Rahayu', 26, '2024-09-23 10:20:00', 50000, 40, 40),
(281, 'Primajasa', 12, '2024-09-24 14:00:00', 60000, 40, 40),
(282, 'Sinar Jaya', 11, '2024-09-23 09:25:00', 30000, 40, 40),
(283, 'Sinar Jaya', 15, '2024-09-22 08:40:00', 30000, 40, 40),
(284, 'Safari Dharma Raya', 28, '2024-09-24 08:40:00', 30000, 40, 40),
(285, 'Sinar Jaya', 2, '2024-09-22 11:50:00', 30000, 40, 40),
(286, 'Safari Dharma Raya', 13, '2024-09-23 11:00:00', 50000, 40, 40),
(287, 'Pahala Kencana', 7, '2024-09-22 13:15:00', 70000, 40, 40),
(288, 'Damri', 20, '2024-09-23 13:30:00', 30000, 40, 40),
(289, 'Damri', 23, '2024-09-23 11:45:00', 30000, 40, 40),
(290, 'Damri', 27, '2024-09-22 10:20:00', 30000, 40, 40),
(318, 'Mitra Rahayu', 10, '2024-09-22 14:55:00', 40000, 40, 40),
(319, 'Safari Dharma Raya', 35, '2024-09-22 13:45:00', 60000, 40, 40),
(320, 'Sinar Jaya', 29, '2024-09-23 10:55:00', 40000, 40, 40),
(321, 'Safari Dharma Raya', 9, '2024-09-22 13:40:00', 50000, 40, 40),
(322, 'Primajasa', 23, '2024-09-23 12:45:00', 30000, 40, 40),
(323, 'Mitra Rahayu', 20, '2024-09-24 13:50:00', 30000, 40, 40),
(324, 'Sinar Jaya', 18, '2024-09-22 10:05:00', 40000, 40, 40),
(325, 'Damri', 11, '2024-09-24 11:45:00', 30000, 40, 40),
(326, 'Sinar Jaya', 6, '2024-09-22 11:55:00', 30000, 40, 40),
(327, 'Primajasa', 16, '2024-09-24 09:55:00', 30000, 40, 40),
(328, 'Rosalia Indah', 7, '2024-09-23 14:30:00', 70000, 40, 40),
(329, 'Pahala Kencana', 28, '2024-09-23 09:05:00', 30000, 40, 40),
(330, 'Safari Dharma Raya', 33, '2024-09-23 08:25:00', 40000, 40, 40),
(331, 'Harapan Jaya', 21, '2024-09-22 10:40:00', 40000, 40, 40),
(332, 'Mitra Rahayu', 1, '2024-09-24 13:25:00', 30000, 40, 40),
(333, 'Gunung Harta', 22, '2024-09-24 12:35:00', 40000, 40, 40),
(334, 'Mitra Rahayu', 19, '2024-09-24 13:50:00', 30000, 40, 40),
(335, 'Damri', 36, '2024-09-22 12:40:00', 70000, 40, 40),
(336, 'Rosalia Indah', 3, '2024-09-22 14:30:00', 30000, 40, 40),
(337, 'Lorena', 12, '2024-09-22 09:40:00', 60000, 40, 40),
(338, 'Safari Dharma Raya', 5, '2024-09-22 10:00:00', 70000, 40, 40),
(339, 'Rosalia Indah', 32, '2024-09-24 08:15:00', 30000, 40, 40),
(340, 'Pahala Kencana', 24, '2024-09-23 10:20:00', 30000, 40, 40),
(341, 'Pahala Kencana', 26, '2024-09-23 09:30:00', 50000, 40, 40),
(342, 'Gunung Harta', 14, '2024-09-24 08:40:00', 40000, 40, 40),
(343, 'Rosalia Indah', 2, '2024-09-23 11:25:00', 30000, 40, 40),
(344, 'Damri', 17, '2024-09-23 09:20:00', 50000, 40, 40),
(345, 'Mitra Rahayu', 30, '2024-09-24 12:35:00', 50000, 40, 40),
(346, 'Harapan Jaya', 13, '2024-09-23 11:50:00', 50000, 40, 40),
(347, 'Rosalia Indah', 27, '2024-09-22 12:25:00', 30000, 40, 40),
(348, 'Harapan Jaya', 34, '2024-09-24 10:50:00', 50000, 40, 40),
(349, 'Pahala Kencana', 25, '2024-09-24 12:40:00', 40000, 40, 40),
(350, 'Rosalia Indah', 15, '2024-09-24 11:05:00', 30000, 40, 40),
(351, 'Mitra Rahayu', 8, '2024-09-22 10:10:00', 60000, 40, 40),
(352, 'Harapan Jaya', 4, '2024-09-23 10:05:00', 60000, 40, 40),
(353, 'Sinar Jaya', 31, '2024-09-24 14:55:00', 60000, 40, 39);

-- --------------------------------------------------------

--
-- Table structure for table cities
--

CREATE TABLE cities (
  city_id int NOT NULL,
  city_name varchar(255) NOT NULL
) ;

--
-- Dumping data for table cities
--

INSERT INTO cities (city_id, city_name) VALUES
(1, 'Surabaya'),
(2, 'Malang'),
(3, 'Jember'),
(4, 'Banyuwangi'),
(5, 'Kediri'),
(6, 'Madiun');

-- --------------------------------------------------------

--
-- Table structure for table routes
--

CREATE TABLE routes (
  route_id int NOT NULL,
  departure_city_id int DEFAULT NULL,
  arrival_city_id int DEFAULT NULL
) ;

--
-- Dumping data for table routes
--

INSERT INTO routes (route_id, departure_city_id, arrival_city_id) VALUES
(1, 1, 2),
(2, 2, 3),
(3, 3, 4),
(4, 5, 1),
(5, 1, 6),
(6, 6, 5),
(7, 6, 1),
(8, 5, 1),
(9, 4, 1),
(10, 3, 1),
(11, 2, 1),
(12, 6, 2),
(13, 5, 2),
(14, 4, 2),
(15, 3, 2),
(16, 1, 2),
(17, 6, 3),
(18, 5, 3),
(19, 4, 3),
(20, 2, 3),
(21, 1, 3),
(22, 6, 4),
(23, 5, 4),
(24, 3, 4),
(25, 2, 4),
(26, 1, 4),
(27, 6, 5),
(28, 4, 5),
(29, 3, 5),
(30, 2, 5),
(31, 1, 5),
(32, 5, 6),
(33, 4, 6),
(34, 3, 6),
(35, 2, 6),
(36, 1, 6);

-- --------------------------------------------------------

--
-- Table structure for table tickets
--

CREATE TABLE tickets (
  ticket_id int NOT NULL,
  user_id int NOT NULL,
  bus_id int NOT NULL,
  no_seat varchar(10) NOT NULL,
  total_price int NOT NULL,
  ticket_code varchar(100) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table tickets
--

INSERT INTO tickets (ticket_id, user_id, bus_id, no_seat, total_price, ticket_code, created_at) VALUES
(11, 1, 29, 'B8', 50000, 'LUX-KT91051', '2024-09-28 18:18:15'),
(12, 1, 90, 'C8', 102500, 'LUX-EC33681', '2024-09-28 18:52:47'),
(13, 1, 353, 'C9', 60000, 'LUX-HS51950', '2024-09-28 18:53:27'),
(18, 1, 33, 'B9', 47500, 'LUX-SV87121', '2024-10-12 16:33:01'),
(19, 1, 29, 'B9', 50000, 'LUX-KT65371', '2024-10-12 17:27:55'),
(20, 1, 29, 'B7', 40000, 'LUX-KF64071', '2024-10-13 02:40:37'),
(21, 1, 29, 'A8', 40000, 'LUX-VA35511', '2024-10-13 02:59:33'),
(22, 1, 29, 'A10', 40000, 'LUX-BF47341', '2024-10-13 02:59:47'),
(23, 1, 29, 'C8', 40000, 'LUX-HL70811', '2024-10-13 03:00:39'),
(24, 1, 29, 'A5', 37500, 'LUX-NA94981', '2024-10-13 03:02:11'),
(25, 1, 29, 'C6', 30000, 'LUX-JK24510', '2024-10-13 03:02:49'),
(26, 1, 29, 'C5', 30000, 'LUX-HB87830', '2024-10-13 03:03:31'),
(27, 1, 29, 'B6', 30000, 'LUX-VW67920', '2024-10-13 03:04:53'),
(28, 1, 29, 'A6', 30000, 'LUX-RG68880', '2024-10-13 03:06:52'),
(29, 1, 29, 'B4', 30000, 'LUX-SK23260', '2024-10-13 03:08:23'),
(30, 1, 3, 'B9', 50000, 'LUX-CV33561', '2024-10-13 03:08:43');

--
-- Triggers tickets
--
-- 1. Buat function untuk trigger
CREATE OR REPLACE FUNCTION decrease_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE buses
    SET available_seats = available_seats - 1
    WHERE bus_id = NEW.bus_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Buat trigger pakai function itu
CREATE TRIGGER decrease_available_seats_trigger
AFTER INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION decrease_available_seats();


-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE users (
  user_id int NOT NULL,
  name varchar(255) NOT NULL,
  gender varchar(255) DEFAULT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table users
--

INSERT INTO users (user_id, name, gender, email, password, created_at) VALUES
(1, 'John Doe', NULL, 'john@example.com', '$2a$10$Xw6Oob3HXVOuxIIBihlAUu1Or/i81K6pCObluTVTpzeQ/71bzaxIS', '2024-09-26 04:24:40'),
(5, 'Muhammad Mumtaz', NULL, 'riedyriedy283@gmail.com', '$2a$10$KDxtz2HLZTFpYIAmjPQ5vOYT3lQwC2aUFNyP1C3r3kDAk67DUCZTm', '2024-10-13 05:27:08'),
(6, 'Muhammad Mumtaz', NULL, 'riedyriedy28334@gmail.com', '$2a$10$C/f9YU1UnLwv4iM2Nfd1mO0yO.gMDMJcsIA3Bb55iXIsvwawNuoDS', '2024-10-13 05:40:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table buses
--
-- Indexes for table buses
-- Indexes for table buses
ALTER TABLE buses
  ADD PRIMARY KEY (bus_id);

CREATE INDEX idx_buses_route_id ON buses(route_id);

-- Indexes for table cities
ALTER TABLE cities
  ADD PRIMARY KEY (city_id);

-- Indexes for table routes
ALTER TABLE routes
  ADD PRIMARY KEY (route_id);

CREATE INDEX idx_routes_departure_city_id ON routes(departure_city_id);
CREATE INDEX idx_routes_arrival_city_id ON routes(arrival_city_id);

-- Indexes for table tickets
ALTER TABLE tickets
  ADD PRIMARY KEY (ticket_id);

CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_bus_id ON tickets(bus_id);

-- Indexes for table users
ALTER TABLE users
  ADD PRIMARY KEY (user_id);

CREATE UNIQUE INDEX idx_users_email ON users(email);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table buses
---- Untuk table buses
ALTER TABLE buses
  ALTER COLUMN bus_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 354 INCREMENT BY 1);

-- Untuk table cities
ALTER TABLE cities
  ALTER COLUMN city_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 7 INCREMENT BY 1);

-- Untuk table routes
ALTER TABLE routes
  ALTER COLUMN route_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 37 INCREMENT BY 1);

-- Untuk table tickets
ALTER TABLE tickets
  ALTER COLUMN ticket_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 31 INCREMENT BY 1);

-- Untuk table users
ALTER TABLE users
  ALTER COLUMN user_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 7 INCREMENT BY 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table buses
--
ALTER TABLE buses
  ADD CONSTRAINT buses_ibfk_1 FOREIGN KEY (route_id) REFERENCES routes (route_id);

--
-- Constraints for table routes
--
ALTER TABLE routes
  ADD CONSTRAINT routes_ibfk_1 FOREIGN KEY (departure_city_id) REFERENCES cities (city_id),
  ADD CONSTRAINT routes_ibfk_2 FOREIGN KEY (arrival_city_id) REFERENCES cities (city_id);

--
-- Constraints for table tickets
--
ALTER TABLE tickets
  ADD CONSTRAINT tickets_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id),
  ADD CONSTRAINT tickets_ibfk_2 FOREIGN KEY (bus_id) REFERENCES buses (bus_id);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
