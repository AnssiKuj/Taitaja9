-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 23.04.2024 klo 22:17
-- Palvelimen versio: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kilpailu`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `finaali`
--

CREATE TABLE `finaali` (
  `JoukkueNimi` varchar(255) NOT NULL,
  `Tehtävä 1` varchar(255) NOT NULL,
  `Tehtävä 2` varchar(255) NOT NULL,
  `Tehtävä 3` varchar(255) NOT NULL,
  `KokonaisAika` varchar(255) NOT NULL,
  `Lohko` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `joukkueet`
--

CREATE TABLE `joukkueet` (
  `JoukkueNimi` varchar(255) NOT NULL,
  `Tehtävä 1` varchar(255) NOT NULL,
  `Tehtävä 2` varchar(255) NOT NULL,
  `Tehtävä 3` varchar(255) NOT NULL,
  `KokonaisAika` varchar(255) NOT NULL,
  `Lohko` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `kerailyerat`
--

CREATE TABLE `kerailyerat` (
  `JoukkueNimi` varchar(255) NOT NULL,
  `Tehtävä 1` varchar(255) NOT NULL,
  `Tehtävä 2` varchar(255) NOT NULL,
  `Tehtävä 3` varchar(255) NOT NULL,
  `KokonaisAika` varchar(255) NOT NULL,
  `Lohko` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `valiera`
--

CREATE TABLE `valiera` (
  `JoukkueNimi` varchar(255) NOT NULL,
  `Tehtävä 1` varchar(255) NOT NULL,
  `Tehtävä 2` varchar(255) NOT NULL,
  `Tehtävä 3` varchar(255) NOT NULL,
  `KokonaisAika` varchar(255) NOT NULL,
  `Lohko` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
