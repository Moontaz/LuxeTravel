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
-- Database: food_ordering
--

-- --------------------------------------------------------

--
-- Table structure for table foodorder
--

CREATE TABLE foodorder (
  order_id int NOT NULL,
  ticket_code varchar(255)  NOT NULL,
  food_items json NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table foodorder
--

INSERT INTO foodorder (order_id, ticket_code, food_items, total_price, created_at) VALUES
(5, 'LUX-KT91051', '[{"food_id":4,"food_name":"Soft Drink","price":"10000.00","quantity":2}]', '20000.00', '2024-09-28 18:18:15'),
(6, 'LUX-EC33681', '[{"food_id":1,"food_name":"Sandwich","price":"20000.00","quantity":1},{"food_id":2,"food_name":"Fruit Salad","price":"25000.00","quantity":1},{"food_id":3,"food_name":"Snack Box","price":"7500.00","quantity":1}]', '52500.00', '2024-09-28 18:52:47'),
(7, 'LUX-SV87121', '[{"price":7500,"food_id":3,"quantity":1,"food_name":"Snack Box"}]', '7500.00', '2024-10-12 16:33:02'),
(8, 'LUX-KT65371', '[{"price":10000,"food_id":4,"quantity":2,"food_name":"Soft Drink"}]', '20000.00', '2024-10-12 17:27:55'),
(9, 'LUX-KF64071', '[{"price":10000,"food_id":4,"quantity":1,"food_name":"Soft Drink"}]', '10000.00', '2024-10-13 02:40:37'),
(10, 'LUX-VA35511', '[{"price":10000,"food_id":4,"quantity":1,"food_name":"Soft Drink"}]', '10000.00', '2024-10-13 02:59:33'),
(11, 'LUX-BF47341', '[{"price":10000,"food_id":4,"quantity":1,"food_name":"Soft Drink"}]', '10000.00', '2024-10-13 02:59:47'),
(12, 'LUX-HL70811', '[{"price":10000,"food_id":4,"quantity":1,"food_name":"Soft Drink"}]', '10000.00', '2024-10-13 03:00:39'),
(13, 'LUX-NA94981', '[{"price":7500,"food_id":3,"quantity":1,"food_name":"Snack Box"}]', '7500.00', '2024-10-13 03:02:11'),
(14, 'LUX-CV33561', '[{"price":10000,"food_id":4,"quantity":2,"food_name":"Soft Drink"}]', '20000.00', '2024-10-13 03:08:43');

-- --------------------------------------------------------

--
-- Table structure for table menu
--

CREATE TABLE menu (
  food_id int NOT NULL,
  food_name varchar(255) NOT NULL,
  price decimal(10,2) NOT NULL,
  "desc" text,
  image_url varchar(255)  NOT NULL
) ;

--
-- Dumping data for table menu
--

INSERT INTO menu (food_id, food_name, price, "desc", image_url) VALUES
(1, 'Sandwich', '20000.00', 'A tasty sandwich', '/images/sandwich.jpg'),
(2, 'Fruit Salad', '25000.00', 'Mixed fresh fruits', '/images/fruitsalad.jpg'),
(3, 'Snack Box', '7500.00', 'Assorted snacks', '/images/snackbox.jpg'),
(4, 'Soft Drink', '10000.00', 'Refreshing beverage', '/images/softdrink.jpg'),
(5, 'Chips', '15000.00', 'Crunchy potato chips', '/images/chips.jpg');

-- --------------------------------------------------------

--
-- Table structure for table user
--

CREATE TABLE users(
  user_id int NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table user
--

INSERT INTO users(user_id, name, email, password, created_at) VALUES
(1, 'Luxe Travel', 'luxetravel@example.com', '$2a$10$Xw6Oob3HXVOuxIIBihlAUu1Or/i81K6pCObluTVTpzeQ/71bzaxIS', '2024-09-28 17:56:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table foodorder
--
-- foodorder
ALTER TABLE foodorder
  ADD PRIMARY KEY (order_id);

-- menu
ALTER TABLE menu
  ADD PRIMARY KEY (food_id);

-- users
ALTER TABLE users
  ADD PRIMARY KEY (user_id);

CREATE UNIQUE INDEX idx_users_email ON users(email);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table foodorder
--
--
-- AUTO_INCREMENT for table menu
--
ALTER TABLE foodorder
  ALTER COLUMN order_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 15 INCREMENT BY 1);


ALTER TABLE menu
  ALTER COLUMN food_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 6 INCREMENT BY 1);

--
-- AUTO_INCREMENT for table user
--
ALTER TABLE users
  ALTER COLUMN user_id
  ADD GENERATED ALWAYS AS IDENTITY (START WITH 2 INCREMENT BY 1);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
