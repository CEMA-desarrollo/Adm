-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2025 a las 20:07:01
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `consultorio_financiero_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id` bigint(20) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `registro_id_afectado` int(11) DEFAULT NULL,
  `detalles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalles`)),
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bitacora`
--

INSERT INTO `bitacora` (`id`, `usuario_id`, `accion`, `tabla_afectada`, `registro_id_afectado`, `detalles`, `fecha`) VALUES
(10, 10, 'ELIMINACIÓN', 'pacientes', 5, '{\"valor_eliminado\":{\"id\":5,\"nombre\":\"123\",\"apellido\":\"321\",\"documento_identidad\":\"v-19105205\",\"numero_historia\":\"123\",\"created_at\":\"2025-06-25T18:37:58.000Z\",\"updated_at\":\"2025-06-25T18:37:58.000Z\"}}', '2025-06-25 19:19:45'),
(11, 10, 'CREACIÓN', 'pacientes', 8, '{\"nuevo_valor\":{\"id\":8,\"nombre\":\"raomn\",\"apellido\":\"valdez\",\"documento_identidad\":\"24511365\",\"numero_historia\":\"502\",\"created_at\":\"2025-06-25T19:20:06.000Z\",\"updated_at\":\"2025-06-25T19:20:06.000Z\"}}', '2025-06-25 19:20:06'),
(12, 10, 'ELIMINACIÓN', 'pacientes', 8, '{\"valor_eliminado\":{\"id\":8,\"nombre\":\"raomn\",\"apellido\":\"valdez\",\"documento_identidad\":\"24511365\",\"numero_historia\":\"502\",\"created_at\":\"2025-06-25T19:20:06.000Z\",\"updated_at\":\"2025-06-25T19:20:06.000Z\"}}', '2025-06-25 19:27:15'),
(13, 10, 'ELIMINACIÓN', 'pacientes', 4, '{\"valor_eliminado\":{\"id\":4,\"nombre\":\"123123\",\"apellido\":\"312312\",\"documento_identidad\":\"1231232\",\"numero_historia\":\"h003\",\"created_at\":\"2025-06-25T18:26:28.000Z\",\"updated_at\":\"2025-06-25T18:26:28.000Z\"}}', '2025-06-25 19:27:19'),
(14, 10, 'CREACIÓN', 'pacientes', 9, '{\"nuevo_valor\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd\",\"documento_identidad\":\"19105208\",\"numero_historia\":\"003\",\"created_at\":\"2025-06-25T19:27:33.000Z\",\"updated_at\":\"2025-06-25T19:27:33.000Z\"}}', '2025-06-25 19:27:33'),
(15, 10, 'ACTUALIZACIÓN', 'pacientes', 9, '{\"valor_anterior\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd\",\"documento_identidad\":\"19105208\",\"numero_historia\":\"003\",\"created_at\":\"2025-06-25T19:27:33.000Z\",\"updated_at\":\"2025-06-25T19:27:33.000Z\"},\"nuevo_valor\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd\",\"documento_identidad\":\"V-19105208\",\"numero_historia\":\"H-003\",\"created_at\":\"2025-06-25T19:27:33.000Z\",\"updated_at\":\"2025-06-25T19:27:33.000Z\"}}', '2025-06-25 19:27:56'),
(16, 10, 'CREACIÓN', 'pacientes', 10, '{\"nuevo_valor\":{\"id\":10,\"nombre\":\"aslala\",\"apellido\":\"papapa\",\"documento_identidad\":\"V-19105258\",\"numero_historia\":\"H-004\",\"created_at\":\"2025-06-25T19:29:55.000Z\",\"updated_at\":\"2025-06-25T19:29:55.000Z\"}}', '2025-06-25 19:29:55'),
(17, 10, 'CREACIÓN', 'pacientes', 12, '{\"nuevo_valor\":{\"id\":12,\"nombre\":\"12341\",\"apellido\":\"2345435\",\"documento_identidad\":\"V-16464987\",\"numero_historia\":\"H-005\",\"created_at\":\"2025-06-25T19:30:34.000Z\",\"updated_at\":\"2025-06-25T19:30:34.000Z\"}}', '2025-06-25 19:30:34'),
(18, 10, 'ACTUALIZACIÓN', 'pacientes', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"H001\",\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-24T02:25:15.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-24T02:25:15.000Z\"}}', '2025-06-25 19:31:01'),
(19, 10, 'ACTUALIZACIÓN', 'pacientes', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"H002\",\"created_at\":\"2025-06-25T18:05:17.000Z\",\"updated_at\":\"2025-06-25T18:05:17.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-25T18:05:17.000Z\",\"updated_at\":\"2025-06-25T18:05:17.000Z\"}}', '2025-06-25 19:31:07'),
(20, 10, 'ACTUALIZACIÓN', 'pacientes', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T06:25:15.000Z\",\"updated_at\":\"2025-06-24T06:25:15.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T06:25:15.000Z\",\"updated_at\":\"2025-06-24T06:25:15.000Z\"}}', '2025-06-26 13:16:22'),
(21, 10, 'ACTUALIZACIÓN', 'pacientes', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-25T22:05:17.000Z\",\"updated_at\":\"2025-06-25T22:05:17.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-25T22:05:17.000Z\",\"updated_at\":\"2025-06-25T22:05:17.000Z\"}}', '2025-06-26 13:16:28'),
(22, 10, 'ACTUALIZACIÓN', 'pacientes', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T10:25:15.000Z\",\"updated_at\":\"2025-06-24T10:25:15.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T10:25:15.000Z\",\"updated_at\":\"2025-06-24T10:25:15.000Z\"}}', '2025-06-26 13:16:52'),
(23, 10, 'ACTUALIZACIÓN', 'pacientes', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-26T02:05:17.000Z\",\"updated_at\":\"2025-06-26T02:05:17.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-26T02:05:17.000Z\",\"updated_at\":\"2025-06-26T02:05:17.000Z\"}}', '2025-06-26 13:16:55'),
(24, 10, 'ACTUALIZACIÓN', 'pacientes', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"001\",\"created_at\":\"2025-06-24T14:25:15.000Z\",\"updated_at\":\"2025-06-24T14:25:15.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"documento_identidad\":\"V-12345678\",\"numero_historia\":\"H-001\",\"created_at\":\"2025-06-24T14:25:15.000Z\",\"updated_at\":\"2025-06-24T14:25:15.000Z\"}}', '2025-06-26 13:19:13'),
(25, 10, 'ACTUALIZACIÓN', 'pacientes', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"19105204\",\"numero_historia\":\"002\",\"created_at\":\"2025-06-26T06:05:17.000Z\",\"updated_at\":\"2025-06-26T06:05:17.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Jose \",\"apellido\":\"Fariña\",\"documento_identidad\":\"V-19105204\",\"numero_historia\":\"H-002\",\"created_at\":\"2025-06-26T06:05:17.000Z\",\"updated_at\":\"2025-06-26T06:05:17.000Z\"}}', '2025-06-26 13:19:19'),
(26, 10, 'CREACIÓN', 'pacientes', 13, '{\"nuevo_valor\":{\"id\":13,\"nombre\":\"ghfh\",\"apellido\":\"fghfg\",\"documento_identidad\":\"V-432423234\",\"numero_historia\":\"H-006\",\"created_at\":\"2025-06-26T13:19:46.000Z\",\"updated_at\":\"2025-06-26T13:19:46.000Z\"}}', '2025-06-26 13:19:46'),
(27, 10, 'ELIMINACIÓN', 'pacientes', 13, '{\"valor_eliminado\":{\"id\":13,\"nombre\":\"ghfh\",\"apellido\":\"fghfg\",\"documento_identidad\":\"V-432423234\",\"numero_historia\":\"H-006\",\"created_at\":\"2025-06-26T13:19:46.000Z\",\"updated_at\":\"2025-06-26T13:19:46.000Z\"}}', '2025-06-26 13:20:22'),
(28, 10, 'ACTUALIZACIÓN', 'pacientes', 12, '{\"valor_anterior\":{\"id\":12,\"nombre\":\"12341\",\"apellido\":\"2345435\",\"documento_identidad\":\"V-16464987\",\"numero_historia\":\"H-005\",\"created_at\":\"2025-06-25T19:30:34.000Z\",\"updated_at\":\"2025-06-25T19:30:34.000Z\"},\"nuevo_valor\":{\"id\":12,\"nombre\":\"12341g\",\"apellido\":\"2345435\",\"documento_identidad\":\"V-16464987\",\"numero_historia\":\"H-005\",\"created_at\":\"2025-06-25T19:30:34.000Z\",\"updated_at\":\"2025-06-25T19:30:34.000Z\"}}', '2025-06-26 13:20:55'),
(29, 10, 'ACTUALIZACIÓN', 'proveedores', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_completo\":\"Dr. Carlos Rivas\",\"especialidad\":\"Cardiología\",\"tipo_proveedor\":\"Medico\",\"activo\":1,\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-23T22:25:15.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre_completo\":\"Dr. Jose Fariña\",\"especialidad\":\"Traumatologo\",\"tipo_proveedor\":\"Medico\",\"activo\":true,\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-23T22:25:15.000Z\"}}', '2025-06-26 13:45:38'),
(30, 10, 'CREACIÓN', 'proveedores', 2, '{\"nuevo_valor\":{\"id\":2,\"nombre_completo\":\"Dr. Antonio Natale\",\"especialidad\":\"Traumatologo\",\"tipo_proveedor\":\"Medico\",\"activo\":1,\"created_at\":\"2025-06-26T13:46:00.000Z\",\"updated_at\":\"2025-06-26T13:46:00.000Z\"}}', '2025-06-26 13:46:00'),
(31, 10, 'CREACIÓN', 'proveedores', 3, '{\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Blanca Antoneli\",\"especialidad\":\"Fisioterapia\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T13:46:27.000Z\",\"updated_at\":\"2025-06-26T13:46:27.000Z\"}}', '2025-06-26 13:46:27'),
(32, 10, 'CREACIÓN', 'proveedores', 4, '{\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisio\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T13:59:49.000Z\",\"updated_at\":\"2025-06-26T13:59:49.000Z\"}}', '2025-06-26 13:59:49'),
(33, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisio\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T13:59:49.000Z\",\"updated_at\":\"2025-06-26T13:59:49.000Z\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisio\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":false,\"created_at\":\"2025-06-26T13:59:49.000Z\",\"updated_at\":\"2025-06-26T13:59:49.000Z\"}}', '2025-06-26 14:00:31'),
(34, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisio\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-26T17:59:49.000Z\",\"updated_at\":\"2025-06-26T17:59:49.000Z\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisioterapia\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":true,\"created_at\":\"2025-06-26T13:59:49.000Z\",\"updated_at\":\"2025-06-26T13:59:49.000Z\"}}', '2025-06-26 14:00:46'),
(35, 10, 'CREACIÓN', 'proveedores', 5, '{\"nuevo_valor\":{\"id\":5,\"nombre_completo\":\"Dr. Nigmet Asis\",\"especialidad\":\"Traumatologo\",\"tipo_proveedor\":\"Medico\",\"activo\":1,\"created_at\":\"2025-06-26T14:02:57.000Z\",\"updated_at\":\"2025-06-26T14:02:57.000Z\"}}', '2025-06-26 14:02:57'),
(36, 10, 'CREACIÓN', 'proveedores', 6, '{\"nuevo_valor\":{\"id\":6,\"nombre_completo\":\"Samantha Pineda\",\"especialidad\":\"\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:03:52.000Z\",\"updated_at\":\"2025-06-26T14:03:52.000Z\"}}', '2025-06-26 14:03:52'),
(37, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"Fisioterapia\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:59:49.000Z\",\"updated_at\":\"2025-06-26T17:59:49.000Z\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad\":\"\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":true,\"created_at\":\"2025-06-26T17:59:49.000Z\",\"updated_at\":\"2025-06-26T17:59:49.000Z\"}}', '2025-06-26 14:04:06'),
(38, 10, 'ACTUALIZACIÓN', 'proveedores', 3, '{\"valor_anterior\":{\"id\":3,\"nombre_completo\":\"Blanca Antoneli\",\"especialidad\":\"Fisioterapia\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T13:46:27.000Z\",\"updated_at\":\"2025-06-26T13:46:27.000Z\"},\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Blanca Antoneli\",\"especialidad\":\"\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":true,\"created_at\":\"2025-06-26T13:46:27.000Z\",\"updated_at\":\"2025-06-26T13:46:27.000Z\"}}', '2025-06-26 14:04:12'),
(39, 10, 'CREACIÓN', 'proveedores', 7, '{\"nuevo_valor\":{\"id\":7,\"nombre_completo\":\"Daniel Rivero\",\"especialidad\":\"\",\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:04:28.000Z\",\"updated_at\":\"2025-06-26T14:04:28.000Z\"}}', '2025-06-26 14:04:28'),
(40, 10, 'ACTUALIZACIÓN', 'servicios', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_servicio\":\"Consulta General\",\"precio_sugerido_usd\":\"50.00\",\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-23T22:25:15.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"50.00\"}}', '2025-06-26 14:12:37'),
(41, 10, 'ACTUALIZACIÓN', 'servicios', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"50.00\",\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-26T14:12:37.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"50.00\"}}', '2025-06-26 14:12:53'),
(42, 10, 'CREACIÓN', 'servicios', 2, '{\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"10.00\",\"created_at\":\"2025-06-26T14:34:08.000Z\",\"updated_at\":\"2025-06-26T14:34:08.000Z\"}}', '2025-06-26 14:34:08'),
(43, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"10.00\",\"activo\":1,\"created_at\":\"2025-06-26T14:34:08.000Z\",\"updated_at\":\"2025-06-26T14:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"10.00\"}}', '2025-06-26 14:47:33'),
(44, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-26T18:34:08.000Z\",\"updated_at\":\"2025-06-26T18:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 14:47:42'),
(45, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-26T18:34:08.000Z\",\"updated_at\":\"2025-06-26T18:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 14:47:46'),
(46, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-26T18:34:08.000Z\",\"updated_at\":\"2025-06-26T18:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 14:48:33'),
(47, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-26T22:34:08.000Z\",\"updated_at\":\"2025-06-26T22:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 15:11:31'),
(48, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 15:11:34'),
(49, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20\",\"activo\":1,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"}}', '2025-06-26 15:24:28'),
(50, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20\",\"activo\":true,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"}}', '2025-06-26 15:24:33'),
(51, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20\",\"activo\":false,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"}}', '2025-06-26 15:24:37'),
(52, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20.00\",\"activo\":0,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20\",\"activo\":true,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"}}', '2025-06-26 15:24:41'),
(53, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terepia Fisica y  Rehabilitacion\",\"precio_sugerido_usd\":\"20\",\"activo\":true,\"created_at\":\"2025-06-27T02:34:08.000Z\",\"updated_at\":\"2025-06-27T02:34:08.000Z\"}}', '2025-06-26 15:24:57'),
(54, 10, 'ACTUALIZACIÓN', 'servicios', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"50.00\",\"activo\":1,\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-26T14:12:37.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"50\",\"activo\":1,\"created_at\":\"2025-06-23T22:25:15.000Z\",\"updated_at\":\"2025-06-26T14:12:37.000Z\"}}', '2025-06-26 15:25:04'),
(55, 10, 'CREACIÓN', 'servicios', 3, '{\"nuevo_valor\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"precio_sugerido_usd\":\"23.00\",\"activo\":1,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:13.000Z\"}}', '2025-06-26 15:25:13'),
(56, 10, 'ELIMINACIÓN', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"precio_sugerido_usd\":\"23.00\",\"activo\":1,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:13.000Z\"}}', '2025-06-26 15:25:16'),
(57, 10, 'CREACIÓN', 'tratamientos', 1, '{\"nuevo_valor\":{\"id\":1,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"50.00\",\"costo_final_acordado_usd\":\"50.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-26T04:00:00.000Z\",\"created_at\":\"2025-06-26T15:46:51.000Z\",\"updated_at\":\"2025-06-26T15:46:51.000Z\"}}', '2025-06-26 15:46:51'),
(58, 10, 'CREACIÓN', 'tratamientos', 2, '{\"nuevo_valor\":{\"id\":2,\"paciente_id\":2,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-26T04:00:00.000Z\",\"created_at\":\"2025-06-26T15:47:49.000Z\",\"updated_at\":\"2025-06-26T15:47:49.000Z\"}}', '2025-06-26 15:47:49'),
(59, 10, 'ELIMINACIÓN', 'tratamientos', 1, '{\"valor_eliminado\":{\"id\":1,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"50.00\",\"costo_final_acordado_usd\":\"50.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-26T04:00:00.000Z\",\"created_at\":\"2025-06-26T15:46:51.000Z\",\"updated_at\":\"2025-06-26T15:46:51.000Z\"}}', '2025-06-26 15:48:06'),
(60, 10, 'ELIMINACIÓN', 'tratamientos', 2, '{\"valor_eliminado\":{\"id\":2,\"paciente_id\":2,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-26T04:00:00.000Z\",\"created_at\":\"2025-06-26T15:47:49.000Z\",\"updated_at\":\"2025-06-26T15:47:49.000Z\"}}', '2025-06-26 15:48:07'),
(61, 10, 'CREACIÓN', 'servicios', 4, '{\"nuevo_valor\":{\"id\":4,\"nombre_servicio\":\"Eco Musculoesquelética\",\"descripcion\":\"\",\"especialidad\":\"Traumatologia\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-26T16:30:58.000Z\",\"updated_at\":\"2025-06-26T16:30:58.000Z\"}}', '2025-06-26 16:30:58'),
(62, 10, 'CREACIÓN', 'pacientes', 14, '{\"nuevo_valor\":{\"id\":14,\"nombre\":\"123123\",\"apellido\":\"123123\",\"documento_identidad\":\"V-4587545\",\"numero_historia\":\"H-1451\",\"created_at\":\"2025-06-26T16:32:37.000Z\",\"updated_at\":\"2025-06-26T16:32:37.000Z\"}}', '2025-06-26 16:32:37'),
(63, 10, 'ACTUALIZACIÓN', 'pacientes', 14, '{\"valor_anterior\":{\"id\":14,\"nombre\":\"123123\",\"apellido\":\"123123\",\"documento_identidad\":\"V-4587545\",\"numero_historia\":\"H-1451\",\"created_at\":\"2025-06-26T16:32:37.000Z\",\"updated_at\":\"2025-06-26T16:32:37.000Z\"},\"nuevo_valor\":{\"id\":14,\"nombre\":\"123123\",\"apellido\":\"123123\",\"documento_identidad\":\"j-45646524\",\"numero_historia\":\"H-1451\",\"created_at\":\"2025-06-26T16:32:37.000Z\",\"updated_at\":\"2025-06-26T16:32:37.000Z\"}}', '2025-06-26 16:32:49'),
(64, 10, 'ELIMINACIÓN', 'pacientes', 14, '{\"valor_eliminado\":{\"id\":14,\"nombre\":\"123123\",\"apellido\":\"123123\",\"documento_identidad\":\"j-45646524\",\"numero_historia\":\"H-1451\",\"created_at\":\"2025-06-26T20:32:37.000Z\",\"updated_at\":\"2025-06-26T20:32:37.000Z\"}}', '2025-06-26 16:32:56'),
(65, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":1,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\"}}', '2025-06-26 17:33:36'),
(66, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:36.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\"}}', '2025-06-26 17:33:41'),
(67, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:36.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":true,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:36.000Z\"}}', '2025-06-26 17:33:50'),
(68, 10, 'ACTUALIZACIÓN', 'especialidades', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":1,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\"}}', '2025-06-26 17:33:55'),
(69, 10, 'ACTUALIZACIÓN', 'especialidades', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:55.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:55.000Z\"}}', '2025-06-26 17:42:01'),
(70, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":1,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:50.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:50.000Z\"}}', '2025-06-26 17:59:03'),
(71, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:19:20'),
(72, 10, 'ACTUALIZACIÓN', 'especialidades', 1, '{\"valor_anterior\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:55.000Z\"},\"nuevo_valor\":{\"id\":1,\"nombre\":\"Traumatologo\",\"descripcion\":null,\"activo\":true,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:33:55.000Z\"}}', '2025-06-26 18:19:24'),
(73, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:36:00'),
(74, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:37:03'),
(75, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:38:51'),
(76, 10, 'ACTUALIZACIÓN', 'servicios', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"50.00\",\"activo\":1,\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-26T18:12:37.000Z\",\"especialidad_nombre\":null},\"nuevo_valor\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"50.00\",\"activo\":true,\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-26T18:12:37.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 18:39:00'),
(77, 10, 'CREACIÓN', 'especialidades', 3, '{\"nuevo_valor\":{\"id\":3,\"nombre\":\"Fisioterapia\",\"descripcion\":\"\",\"activo\":1,\"created_at\":\"2025-06-26T18:45:07.000Z\",\"updated_at\":\"2025-06-26T18:45:07.000Z\"}}', '2025-06-26 18:45:07'),
(78, 10, 'ACTUALIZACIÓN', 'especialidades', 3, '{\"valor_anterior\":{\"id\":3,\"nombre\":\"Fisioterapia\",\"descripcion\":\"\",\"activo\":1,\"created_at\":\"2025-06-26T18:45:07.000Z\",\"updated_at\":\"2025-06-26T18:45:07.000Z\"},\"nuevo_valor\":{\"id\":3,\"nombre\":\"Fisioterapeuta\",\"descripcion\":\"\",\"activo\":true,\"created_at\":\"2025-06-26T18:45:07.000Z\",\"updated_at\":\"2025-06-26T18:45:07.000Z\"}}', '2025-06-26 18:49:04'),
(79, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:51:04'),
(80, 10, 'ELIMINACIÓN', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"23.00\",\"activo\":0,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:16.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 18:53:01'),
(81, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terepia Fisica y  Rehabilitacion\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\",\"especialidad_nombre\":null},\"nuevo_valor\":{\"id\":2,\"nombre_servicio\":\"Terepia Fisica y  Rehabilitacion\",\"especialidad_id\":3,\"descripcion\":null,\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-27T06:34:08.000Z\",\"updated_at\":\"2025-06-27T06:34:08.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 18:53:16'),
(82, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 18:57:50'),
(83, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 19:01:35'),
(84, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 19:02:02'),
(85, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":true,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 19:04:40'),
(86, 10, 'ACTUALIZACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":1,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:40.000Z\"},\"nuevo_valor\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":false,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T17:59:03.000Z\"}}', '2025-06-26 19:04:44'),
(87, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 19:44:34'),
(88, 10, 'ELIMINACIÓN', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"23.00\",\"activo\":0,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:16.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 19:44:44'),
(89, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 19:54:41'),
(90, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 19:54:49'),
(91, 10, 'ELIMINACIÓN', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"23.00\",\"activo\":0,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:16.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 19:56:59'),
(92, 10, 'ELIMINACIÓN', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"23.00\",\"activo\":0,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:16.000Z\",\"especialidad_nombre\":null}}', '2025-06-26 20:00:45'),
(93, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 20:00:48'),
(94, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 20:05:24'),
(95, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-26 20:06:16'),
(96, 10, 'ELIMINACIÓN', 'pacientes', 12, '{\"valor_desactivado\":{\"id\":12,\"nombre\":\"12341g\",\"apellido\":\"2345435\",\"documento_identidad\":\"V-16464987\",\"numero_historia\":\"H-005\",\"activo\":1,\"created_at\":\"2025-06-25T23:30:34.000Z\",\"updated_at\":\"2025-06-25T23:30:34.000Z\"}}', '2025-06-26 20:06:46'),
(97, 10, 'ACTUALIZACIÓN', 'proveedores', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_completo\":\"Dr. Jose Fariña\",\"especialidad_id\":1,\"tipo_proveedor\":\"Medico\",\"activo\":1,\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":1,\"nombre_completo\":\"Dr. Jose Fariña\",\"especialidad_id\":1,\"tipo_proveedor\":\"Medico\",\"activo\":true,\"created_at\":\"2025-06-24T02:25:15.000Z\",\"updated_at\":\"2025-06-26T17:09:55.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-26 20:21:12'),
(98, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-28 13:54:06'),
(99, 10, 'ACTUALIZACIÓN', 'pacientes', 9, '{\"valor_anterior\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd\",\"documento_identidad\":\"V-19105208\",\"numero_historia\":\"H-003\",\"activo\":1,\"created_at\":\"2025-06-25T23:27:33.000Z\",\"updated_at\":\"2025-06-25T23:27:33.000Z\"},\"nuevo_valor\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd23\",\"documento_identidad\":\"V-19105208\",\"numero_historia\":\"H-003\",\"activo\":1,\"created_at\":\"2025-06-25T23:27:33.000Z\",\"updated_at\":\"2025-06-25T23:27:33.000Z\"}}', '2025-06-28 13:54:53'),
(100, 10, 'ACTUALIZACIÓN', 'pacientes', 9, '{\"valor_anterior\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd23\",\"documento_identidad\":\"V-19105208\",\"numero_historia\":\"H-003\",\"activo\":1,\"created_at\":\"2025-06-26T03:27:33.000Z\",\"updated_at\":\"2025-06-26T03:27:33.000Z\"},\"nuevo_valor\":{\"id\":9,\"nombre\":\"asdasd\",\"apellido\":\"asdasd232\",\"documento_identidad\":\"V-19105208\",\"numero_historia\":\"H-003\",\"activo\":1,\"created_at\":\"2025-06-26T03:27:33.000Z\",\"updated_at\":\"2025-06-26T03:27:33.000Z\"}}', '2025-06-28 14:03:19'),
(101, 10, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-06-28 14:21:30'),
(102, 10, 'ACTUALIZACIÓN', 'servicios', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_servicio\":\"Eco Musculoesquelética\",\"especialidad_id\":2,\"descripcion\":\"\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-26T16:30:58.000Z\",\"updated_at\":\"2025-06-26T17:09:56.000Z\",\"especialidad_nombre\":\"Traumatologia22\"},\"nuevo_valor\":{\"id\":4,\"nombre_servicio\":\"Eco Musculoesquelética\",\"especialidad_id\":1,\"descripcion\":\"\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-26T16:30:58.000Z\",\"updated_at\":\"2025-06-26T17:09:56.000Z\",\"especialidad_nombre\":\"Traumatologia22\"}}', '2025-06-28 14:22:14'),
(103, 10, 'ACTUALIZACIÓN', 'servicios', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_servicio\":\"Eco Musculoesquelética\",\"especialidad_id\":1,\"descripcion\":\"\",\"precio_sugerido_usd\":\"20.00\",\"activo\":1,\"created_at\":\"2025-06-26T16:30:58.000Z\",\"updated_at\":\"2025-06-28T14:22:14.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":4,\"nombre_servicio\":\"Eco Musculoesquelética\",\"precio_sugerido_usd\":\"20.00\",\"especialidad_id\":1,\"descripcion\":\"hola\",\"activo\":true}}', '2025-06-28 14:39:07'),
(104, 10, 'CREACIÓN', 'servicios', 5, '{\"nuevo_valor\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"precio_sugerido_usd\":\"1\",\"especialidad_id\":1,\"descripcion\":\"123\"}}', '2025-06-28 14:39:59'),
(105, 10, 'ACTUALIZACIÓN', 'servicios', 5, '{\"valor_anterior\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"especialidad_id\":1,\"descripcion\":\"123\",\"precio_sugerido_usd\":\"1.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:39:59.000Z\",\"updated_at\":\"2025-06-28T14:39:59.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"precio_sugerido_usd\":\"1\",\"especialidad_id\":1,\"descripcion\":\"123\",\"activo\":true}}', '2025-06-28 14:40:05'),
(106, 10, 'ELIMINACIÓN LÓGICA', 'servicios', 5, '{\"valor_desactivado\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"especialidad_id\":1,\"descripcion\":\"123\",\"precio_sugerido_usd\":\"1.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:39:59.000Z\",\"updated_at\":\"2025-06-28T14:39:59.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 14:40:22'),
(107, 10, 'CREACIÓN', 'servicios', 6, '{\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10\",\"especialidad_id\":1,\"descripcion\":null}}', '2025-06-28 14:40:35'),
(108, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T14:40:35.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":false}}', '2025-06-28 14:40:44'),
(109, 10, 'ELIMINACIÓN LÓGICA', 'servicios', 6, '{\"valor_desactivado\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T14:40:44.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 15:14:19'),
(110, 10, 'ACTUALIZACIÓN', 'servicios', 5, '{\"valor_anterior\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"especialidad_id\":1,\"descripcion\":\"123\",\"precio_sugerido_usd\":\"1.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:39:59.000Z\",\"updated_at\":\"2025-06-28T14:40:22.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"precio_sugerido_usd\":\"1.00\",\"especialidad_id\":1,\"descripcion\":\"123\",\"activo\":true}}', '2025-06-28 15:14:33'),
(111, 10, 'ACTUALIZACIÓN', 'servicios', 5, '{\"valor_anterior\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"especialidad_id\":1,\"descripcion\":\"123\",\"precio_sugerido_usd\":\"1.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:39:59.000Z\",\"updated_at\":\"2025-06-28T15:14:33.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"precio_sugerido_usd\":\"1.00\",\"especialidad_id\":1,\"descripcion\":\"123\",\"activo\":false}}', '2025-06-28 15:14:44'),
(112, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T14:40:44.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":true}}', '2025-06-28 15:17:58'),
(113, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:17:58.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":false}}', '2025-06-28 15:18:07'),
(114, 10, 'ELIMINACIÓN LÓGICA', 'servicios', 6, '{\"valor_desactivado\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:18:07.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 15:18:12'),
(115, 10, 'ELIMINACIÓN LÓGICA', 'servicios', 6, '{\"valor_desactivado\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:18:07.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 15:18:18'),
(116, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:18:07.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":true}}', '2025-06-28 15:19:09'),
(117, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:19:09.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":false}}', '2025-06-28 15:19:29'),
(118, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:19:29.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":true}}', '2025-06-28 15:24:02'),
(119, 10, 'ACTUALIZACIÓN', 'servicios', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":1,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:24:02.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":6,\"nombre_servicio\":\"123\",\"precio_sugerido_usd\":\"10.00\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":false}}', '2025-06-28 15:24:06'),
(120, 10, 'ELIMINACIÓN PERMANENTE', 'servicios', 6, '{\"valor_eliminado\":{\"id\":6,\"nombre_servicio\":\"123\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"10.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:40:35.000Z\",\"updated_at\":\"2025-06-28T15:24:06.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 15:58:24'),
(121, 10, 'ELIMINACIÓN PERMANENTE', 'servicios', 3, '{\"valor_eliminado\":{\"id\":3,\"nombre_servicio\":\"asdas\",\"especialidad_id\":null,\"descripcion\":null,\"precio_sugerido_usd\":\"23.00\",\"activo\":0,\"created_at\":\"2025-06-26T15:25:13.000Z\",\"updated_at\":\"2025-06-26T15:25:16.000Z\",\"especialidad_nombre\":null}}', '2025-06-28 15:58:39'),
(122, 10, 'ACTUALIZACIÓN', 'servicios', 1, '{\"valor_anterior\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"especialidad_id\":1,\"descripcion\":null,\"precio_sugerido_usd\":\"50.00\",\"activo\":1,\"created_at\":\"2025-06-24T06:25:15.000Z\",\"updated_at\":\"2025-06-26T22:12:37.000Z\",\"especialidad_nombre\":\"Traumatologo\"},\"nuevo_valor\":{\"id\":1,\"nombre_servicio\":\"Consulta Traumatologica\",\"precio_sugerido_usd\":\"40\",\"especialidad_id\":1,\"descripcion\":null,\"activo\":true}}', '2025-06-28 15:58:51'),
(123, 10, 'ELIMINACIÓN PERMANENTE', 'servicios', 5, '{\"valor_eliminado\":{\"id\":5,\"nombre_servicio\":\"prueba\",\"especialidad_id\":1,\"descripcion\":\"123\",\"precio_sugerido_usd\":\"1.00\",\"activo\":0,\"created_at\":\"2025-06-28T14:39:59.000Z\",\"updated_at\":\"2025-06-28T15:14:44.000Z\",\"especialidad_nombre\":\"Traumatologo\"}}', '2025-06-28 15:59:01'),
(124, 10, 'CREACIÓN', 'pacientes', 15, '{\"nuevo_valor\":{\"id\":15,\"nombre\":\"123\",\"apellido\":\"123\",\"documento_identidad\":\"V-4334534\",\"numero_historia\":\"H-2021\",\"activo\":1,\"created_at\":\"2025-06-28T16:04:52.000Z\",\"updated_at\":\"2025-06-28T16:04:52.000Z\"}}', '2025-06-28 16:04:52'),
(125, 10, 'ACTUALIZACIÓN', 'pacientes', 15, '{\"valor_anterior\":{\"id\":15,\"nombre\":\"123\",\"apellido\":\"123\",\"documento_identidad\":\"V-4334534\",\"numero_historia\":\"H-2021\",\"activo\":1,\"created_at\":\"2025-06-28T16:04:52.000Z\",\"updated_at\":\"2025-06-28T16:04:52.000Z\"},\"nuevo_valor\":{\"id\":15,\"nombre\":\"123\",\"apellido\":\"123123\",\"documento_identidad\":\"V-4334534\",\"numero_historia\":\"H-2021\",\"activo\":1,\"created_at\":\"2025-06-28T16:04:52.000Z\",\"updated_at\":\"2025-06-28T16:04:52.000Z\"}}', '2025-06-28 16:04:59'),
(126, 10, 'ELIMINACIÓN', 'pacientes', 15, '{\"valor_desactivado\":{\"id\":15,\"nombre\":\"123\",\"apellido\":\"123123\",\"documento_identidad\":\"V-4334534\",\"numero_historia\":\"H-2021\",\"activo\":1,\"created_at\":\"2025-06-28T20:04:52.000Z\",\"updated_at\":\"2025-06-28T20:04:52.000Z\"}}', '2025-06-28 16:05:03'),
(127, 10, 'ACTUALIZACIÓN', 'proveedores', 7, '{\"valor_anterior\":{\"id\":7,\"nombre_completo\":\"Daniel Rivero\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:04:28.000Z\",\"updated_at\":\"2025-06-26T18:47:24.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":7,\"nombre_completo\":\"Lic. Daniel Rivero\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:04:28.000Z\",\"updated_at\":\"2025-06-28T16:07:10.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:07:10'),
(128, 10, 'ACTUALIZACIÓN', 'proveedores', 6, '{\"valor_anterior\":{\"id\":6,\"nombre_completo\":\"Samantha Pineda\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:03:52.000Z\",\"updated_at\":\"2025-06-26T18:47:13.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":6,\"nombre_completo\":\"Lic. Samantha Pineda\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T14:03:52.000Z\",\"updated_at\":\"2025-06-28T16:07:21.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:07:21'),
(129, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-06-26T18:47:03.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Lic. Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-06-28T16:07:31.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:07:31');
INSERT INTO `bitacora` (`id`, `usuario_id`, `accion`, `tabla_afectada`, `registro_id_afectado`, `detalles`, `fecha`) VALUES
(130, 10, 'ACTUALIZACIÓN', 'proveedores', 3, '{\"valor_anterior\":{\"id\":3,\"nombre_completo\":\"Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-26T18:46:40.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:07:48.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:07:48'),
(131, 10, 'ACTUALIZACIÓN', 'proveedores', 3, '{\"valor_anterior\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:07:48.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:07:48.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:07:58'),
(132, 10, 'ACTUALIZACIÓN', 'proveedores', 3, '{\"valor_anterior\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:07:48.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:08:06.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:08:06'),
(133, 10, 'ACTUALIZACIÓN', 'proveedores', 3, '{\"valor_anterior\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:08:06.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":3,\"nombre_completo\":\"Lic. Blanca Antoneli\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T17:46:27.000Z\",\"updated_at\":\"2025-06-28T16:08:35.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:08:35'),
(134, 10, 'CREACIÓN', 'proveedores', 8, '{\"nuevo_valor\":{\"id\":8,\"nombre_completo\":\"12312\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-28T16:09:08.000Z\",\"updated_at\":\"2025-06-28T16:09:08.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:09:08'),
(135, 10, 'ELIMINACIÓN LÓGICA', 'proveedores', 8, '{\"valor_desactivado\":{\"id\":8,\"nombre_completo\":\"12312\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-28T16:09:08.000Z\",\"updated_at\":\"2025-06-28T16:09:08.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:09:13'),
(136, 10, 'ELIMINACIÓN LÓGICA', 'proveedores', 8, '{\"valor_desactivado\":{\"id\":8,\"nombre_completo\":\"12312\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-28T16:09:08.000Z\",\"updated_at\":\"2025-06-28T16:09:13.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:09:18'),
(137, 10, 'ELIMINACIÓN PERMANENTE', 'proveedores', 8, '{\"valor_eliminado\":{\"id\":8,\"nombre_completo\":\"12312\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-28T16:09:08.000Z\",\"updated_at\":\"2025-06-28T16:09:13.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-06-28 16:18:53'),
(138, 10, 'CREACIÓN', 'tratamientos', 3, '{\"nuevo_valor\":{\"id\":3,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T13:02:24.000Z\",\"updated_at\":\"2025-06-30T13:02:24.000Z\"}}', '2025-06-30 13:02:24'),
(139, 10, 'ACTUALIZACIÓN', 'tratamientos', 3, '{\"valor_anterior\":{\"id\":3,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T13:02:24.000Z\",\"updated_at\":\"2025-06-30T13:02:24.000Z\"},\"nuevo_valor\":{\"id\":3,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-30\",\"created_at\":\"2025-06-30T13:02:24.000Z\",\"updated_at\":\"2025-06-30T13:02:24.000Z\"}}', '2025-06-30 13:30:26'),
(140, 10, 'CREACIÓN', 'tratamientos', 4, '{\"nuevo_valor\":{\"id\":4,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":4,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"facturado\":0,\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T13:30:55.000Z\",\"updated_at\":\"2025-06-30T13:30:55.000Z\"}}', '2025-06-30 13:30:55'),
(141, 10, 'CREACIÓN', 'tratamientos', 5, '{\"nuevo_valor\":{\"id\":5,\"paciente_id\":1,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T13:39:34.000Z\",\"updated_at\":\"2025-06-30T13:39:34.000Z\"}}', '2025-06-30 13:39:34'),
(142, 10, 'CREACIÓN', 'tratamientos', 6, '{\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T14:34:22.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 14:34:22'),
(143, 10, 'ACTUALIZACIÓN', 'tratamientos', 6, '{\"valor_anterior\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T14:34:22.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"},\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T14:34:22.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 14:36:18'),
(144, 10, 'ACTUALIZACIÓN', 'tratamientos', 6, '{\"valor_anterior\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T14:36:18.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"},\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Cancelado\",\"fecha_tratamiento\":\"2025-07-01\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T14:36:18.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 16:30:32'),
(145, 10, 'ACTUALIZACIÓN', 'tratamientos', 6, '{\"valor_anterior\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Cancelado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:30:32.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"},\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:30:32.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 16:30:37'),
(146, 10, 'ACTUALIZACIÓN', 'tratamientos', 6, '{\"valor_anterior\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:30:37.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"},\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Cancelado\",\"fecha_tratamiento\":\"2025-07-01\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:30:37.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 16:31:13'),
(147, 10, 'ACTUALIZACIÓN', 'tratamientos', 6, '{\"valor_anterior\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Cancelado\",\"fecha_tratamiento\":\"2025-07-01T04:00:00.000Z\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:31:13.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"},\"nuevo_valor\":{\"id\":6,\"paciente_id\":2,\"proveedor_id\":2,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"35.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-01\",\"created_at\":\"2025-07-01T14:34:22.000Z\",\"updated_at\":\"2025-07-01T16:31:13.000Z\",\"paciente_nombre\":\"Jose  Fariña\",\"proveedor_nombre\":\"Dr. Antonio Natale\",\"servicio_nombre\":\"Consulta Traumatologica\"}}', '2025-07-01 16:31:39'),
(148, 10, 'CREACIÓN', 'tratamientos', 7, '{\"nuevo_valor\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"estado\":\"\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:27:42.000Z\"}}', '2025-07-02 12:27:42'),
(149, 10, 'ACTUALIZACIÓN', 'tratamientos', 7, '{\"valor_anterior\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"estado\":\"\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:27:42.000Z\"},\"nuevo_valor\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:27:57.000Z\"}}', '2025-07-02 12:27:57'),
(150, 10, 'ACTUALIZACIÓN', 'tratamientos', 7, '{\"valor_anterior\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"20.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:27:57.000Z\"},\"nuevo_valor\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"15.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:28:17.000Z\"}}', '2025-07-02 12:28:17'),
(151, 10, 'ACTUALIZACIÓN', 'tratamientos', 7, '{\"valor_anterior\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"15.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:28:17.000Z\"},\"nuevo_valor\":{\"id\":7,\"paciente_id\":1,\"proveedor_id\":6,\"servicio_id\":2,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"20.00\",\"costo_final_acordado_usd\":\"15.00\",\"justificacion_descuento\":\"\",\"estado\":\"Cancelado\",\"fecha_tratamiento\":\"2025-07-02T04:00:00.000Z\",\"created_at\":\"2025-07-02T12:27:42.000Z\",\"updated_at\":\"2025-07-02T12:28:22.000Z\"}}', '2025-07-02 12:28:22'),
(152, 10, 'ACTUALIZACIÓN', 'tratamientos', 3, '{\"valor_anterior\":{\"id\":3,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"estado\":\"Programado\",\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T17:02:24.000Z\",\"updated_at\":\"2025-06-30T17:02:24.000Z\"},\"nuevo_valor\":{\"id\":3,\"paciente_id\":2,\"proveedor_id\":1,\"servicio_id\":1,\"descripcion_adicional\":\"\",\"costo_original_usd\":\"40.00\",\"costo_final_acordado_usd\":\"40.00\",\"justificacion_descuento\":\"\",\"estado\":\"Realizado\",\"fecha_tratamiento\":\"2025-06-30T04:00:00.000Z\",\"created_at\":\"2025-06-30T17:02:24.000Z\",\"updated_at\":\"2025-07-02T12:29:31.000Z\"}}', '2025-07-02 12:29:31'),
(153, 10, 'CREACIÓN', 'usuarios', 14, '{\"nuevo_valor\":{\"id\":14,\"nombre_usuario\":\"Jose\",\"rol\":\"admin\"}}', '2025-07-02 13:53:08'),
(154, 10, 'ACTUALIZACIÓN', 'usuarios', 14, '{\"valor_anterior\":{\"nombre_usuario\":\"Jose\",\"nombre\":\"\",\"apellido\":\"\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"admin\",\"activo\":1},\"cambios\":{\"nombre_usuario\":\"Jose\",\"nombre\":\"Jose\",\"apellido\":\"Fariña\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"admin\",\"activo\":true}}', '2025-07-02 15:15:02'),
(155, 10, 'ACTUALIZACIÓN', 'usuarios', 12, '{\"valor_anterior\":{\"nombre_usuario\":\"Antonella\",\"nombre\":\"\",\"apellido\":\"\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":1},\"cambios\":{\"nombre_usuario\":\"Antonella\",\"nombre\":\"Antonella\",\"apellido\":\"Ruggiero\",\"fecha_nacimiento\":\"2025-07-02\",\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":true}}', '2025-07-02 18:21:38'),
(156, 14, 'ACTUALIZACIÓN', 'usuarios', 11, '{\"valor_anterior\":{\"nombre_usuario\":\"Gabriela\",\"nombre\":\"\",\"apellido\":\"\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":1},\"cambios\":{\"nombre_usuario\":\"Gabriela\",\"nombre\":\"Gabriela\",\"apellido\":\"Escalona\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":true}}', '2025-07-02 19:45:17'),
(157, 14, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-02 19:46:23'),
(158, 14, 'ELIMINACIÓN', 'especialidades', 2, '{\"valor_eliminado\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-03 11:35:23'),
(159, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-03 12:47:52'),
(160, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-03 13:27:51'),
(161, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-04 12:09:46'),
(162, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-04 12:19:34'),
(163, 14, 'CREACIÓN', 'servicios', 7, '{\"nuevo_valor\":{\"id\":7,\"nombre_servicio\":\"Microelectrólisis Percutánea (MEP)\",\"precio_sugerido_usd\":\"40\",\"especialidad_id\":3,\"descripcion\":null}}', '2025-07-04 12:21:53'),
(164, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-04 12:26:26'),
(165, 14, 'DESACTIVACIÓN', 'especialidades', 2, '{\"valor_anterior\":{\"id\":2,\"nombre\":\"Traumatologia22\",\"descripcion\":null,\"activo\":0,\"created_at\":\"2025-06-26T17:09:55.000Z\",\"updated_at\":\"2025-06-26T19:04:44.000Z\"}}', '2025-07-04 12:26:41'),
(166, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Lic. Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-06-28T16:07:31.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Lic. Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-07-07T13:19:04.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-07-07 13:19:04'),
(167, 10, 'ACTUALIZACIÓN', 'proveedores', 4, '{\"valor_anterior\":{\"id\":4,\"nombre_completo\":\"Lic. Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":0,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-07-07T13:19:04.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"},\"nuevo_valor\":{\"id\":4,\"nombre_completo\":\"Lic. Betania Garcia\",\"especialidad_id\":3,\"tipo_proveedor\":\"Fisioterapeuta\",\"activo\":1,\"created_at\":\"2025-06-26T21:59:49.000Z\",\"updated_at\":\"2025-07-07T13:19:11.000Z\",\"especialidad_nombre\":\"Fisioterapeuta\"}}', '2025-07-07 13:19:11'),
(168, 10, 'ACTUALIZACIÓN', 'usuarios', 11, '{\"valor_anterior\":{\"nombre_usuario\":\"Gabriela\",\"nombre\":\"Gabriela\",\"apellido\":\"Escalona\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":1},\"cambios\":{\"nombre_usuario\":\"Gabriela\",\"nombre\":\"Gabriela\",\"apellido\":\"Escalona1\",\"fecha_nacimiento\":null,\"url_imagen\":null,\"rol\":\"Recepción\",\"activo\":true}}', '2025-07-07 13:20:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Traumatologo', NULL, 1, '2025-06-26 17:09:55', '2025-06-26 18:19:24'),
(2, 'Traumatologia22', NULL, 0, '2025-06-26 17:09:55', '2025-06-26 19:04:44'),
(3, 'Fisioterapeuta', '', 1, '2025-06-26 18:45:07', '2025-06-26 18:49:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `documento_identidad` varchar(20) NOT NULL,
  `numero_historia` varchar(25) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `documento_identidad`, `numero_historia`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Juan', 'Perez', 'V-12345678', 'H-001', 1, '2025-06-24 18:25:15', '2025-06-24 18:25:15'),
(2, 'Jose ', 'Fariña', 'V-19105204', 'H-002', 1, '2025-06-26 10:05:17', '2025-06-26 10:05:17'),
(9, 'asdasd', 'asdasd232', 'V-19105208', 'H-003', 1, '2025-06-26 07:27:33', '2025-06-26 07:27:33'),
(10, 'aslala', 'papapa', 'V-19105258', 'H-004', 1, '2025-06-25 19:29:55', '2025-06-25 19:29:55'),
(12, '12341g', '2345435', 'V-16464987', 'H-005', 0, '2025-06-25 23:30:34', '2025-06-26 20:06:46'),
(15, '123', '123123', 'V-4334534', 'H-2021', 0, '2025-06-28 20:04:52', '2025-06-28 16:05:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `tratamiento_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `moneda_pago` enum('USD','VES') NOT NULL,
  `metodo_pago` enum('Efectivo','Transferencia','Zelle','Punto de Venta','Saldo a Favor') NOT NULL,
  `tasa_cambio_aplicada` decimal(18,4) DEFAULT NULL,
  `referencia_pago` varchar(255) DEFAULT NULL,
  `fecha_pago` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(200) NOT NULL,
  `especialidad_id` int(11) DEFAULT NULL,
  `tipo_proveedor` enum('Medico','Fisioterapeuta','Otro') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre_completo`, `especialidad_id`, `tipo_proveedor`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Jose Fariña', 1, 'Medico', 1, '2025-06-24 02:25:15', '2025-06-26 17:09:55'),
(2, 'Dr. Antonio Natale', 1, 'Medico', 1, '2025-06-26 13:46:00', '2025-06-26 17:09:55'),
(3, 'Lic. Blanca Antoneli', 3, 'Fisioterapeuta', 1, '2025-06-26 17:46:27', '2025-06-28 16:08:35'),
(4, 'Lic. Betania Garcia', 3, 'Fisioterapeuta', 1, '2025-06-26 21:59:49', '2025-07-07 13:19:11'),
(5, 'Dr. Nigmet Asis', 1, 'Medico', 1, '2025-06-26 14:02:57', '2025-06-26 17:09:55'),
(6, 'Lic. Samantha Pineda', 3, 'Fisioterapeuta', 1, '2025-06-26 14:03:52', '2025-06-28 16:07:21'),
(7, 'Lic. Daniel Rivero', 3, 'Fisioterapeuta', 1, '2025-06-26 14:04:28', '2025-06-28 16:07:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor_servicios`
--

CREATE TABLE `proveedor_servicios` (
  `proveedor_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedor_servicios`
--

INSERT INTO `proveedor_servicios` (`proveedor_id`, `servicio_id`) VALUES
(1, 1),
(1, 4),
(2, 1),
(3, 2),
(4, 2),
(6, 2),
(6, 7),
(7, 2),
(7, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre_servicio` varchar(255) NOT NULL,
  `especialidad_id` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_sugerido_usd` decimal(12,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre_servicio`, `especialidad_id`, `descripcion`, `precio_sugerido_usd`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Consulta Traumatologica', 1, NULL, 40.00, 1, '2025-06-24 06:25:15', '2025-06-28 15:58:51'),
(2, 'Terepia Fisica y  Rehabilitacion', 3, NULL, 20.00, 1, '2025-06-27 06:34:08', '2025-06-26 18:53:16'),
(4, 'Eco Musculoesquelética', 1, 'hola', 20.00, 1, '2025-06-26 16:30:58', '2025-06-28 14:39:07'),
(7, 'Microelectrólisis Percutánea (MEP)', 3, NULL, 40.00, 1, '2025-07-04 12:21:53', '2025-07-04 12:21:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasas_cambio`
--

CREATE TABLE `tasas_cambio` (
  `id` int(11) NOT NULL,
  `tasa_bs_por_usd` decimal(10,4) NOT NULL,
  `fecha` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tasas_cambio`
--
-- Manteniendo el dato existente, adaptado a la nueva estructura:
-- El id original era 1, fecha '2025-06-24', tasa 40.5000.
-- created_at será el 'fecha_registro' original. updated_at se autocompletará.

INSERT INTO `tasas_cambio` (`id`, `fecha`, `tasa_bs_por_usd`, `created_at`) VALUES
(1, '2025-06-24', 40.5000, '2025-06-23 22:25:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamientos`
--

CREATE TABLE `tratamientos` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `descripcion_adicional` text DEFAULT NULL,
  `costo_original_usd` decimal(12,2) NOT NULL,
  `costo_final_acordado_usd` decimal(12,2) NOT NULL,
  `justificacion_descuento` text DEFAULT NULL,
  `estado` enum('Programado','Realizado','Cancelado') NOT NULL DEFAULT 'Programado',
  `fecha_tratamiento` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tratamientos`
--

INSERT INTO `tratamientos` (`id`, `paciente_id`, `proveedor_id`, `servicio_id`, `descripcion_adicional`, `costo_original_usd`, `costo_final_acordado_usd`, `justificacion_descuento`, `estado`, `fecha_tratamiento`, `created_at`, `updated_at`) VALUES
(3, 2, 1, 1, '', 40.00, 40.00, '', 'Realizado', '2025-06-30', '2025-06-30 17:02:24', '2025-07-02 12:29:31'),
(4, 2, 1, 4, '', 20.00, 20.00, '', 'Programado', '2025-06-30', '2025-06-30 13:30:55', '2025-06-30 13:30:55'),
(5, 1, 1, 1, '', 40.00, 20.00, '', 'Programado', '2025-06-30', '2025-06-30 13:39:34', '2025-06-30 13:39:34'),
(6, 2, 2, 1, '', 40.00, 35.00, '', 'Programado', '2025-07-01', '2025-07-01 14:34:22', '2025-07-01 16:31:39'),
(7, 1, 6, 2, '', 20.00, 15.00, '', 'Cancelado', '2025-07-02', '2025-07-02 12:27:42', '2025-07-02 12:28:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('Administrador','Encargado','Recepción','Propietario') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `nombre`, `apellido`, `fecha_nacimiento`, `url_imagen`, `password`, `rol`, `activo`, `created_at`, `updated_at`) VALUES
(10, 'admin', '', '', NULL, NULL, '123', 'Administrador', 1, '2025-06-25 17:29:34', '2025-07-02 16:15:29'),
(11, 'Gabriela', 'Gabriela', 'Escalona', NULL, NULL, '123', 'Recepción', 1, '2025-06-26 17:39:15', '2025-07-07 18:06:55'),
(12, 'Antonella', 'Antonella', 'Ruggiero', '2025-07-02', NULL, '123', 'Recepción', 1, '2025-06-26 17:54:14', '2025-07-02 18:21:38'),
(14, 'Jose', 'Jose', 'Fariña', NULL, NULL, 'migdalia3', 'Administrador', 1, '2025-07-02 13:53:08', '2025-07-02 16:15:37');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_usuario_id` (`usuario_id`),
  ADD KEY `idx_tabla_afectada` (`tabla_afectada`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_unico` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`),
  ADD UNIQUE KEY `numero_historia` (`numero_historia`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `tratamiento_id` (`tratamiento_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_fecha_pago` (`fecha_pago`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proveedor_especialidad` (`especialidad_id`);

--
-- Indices de la tabla `proveedor_servicios`
--
ALTER TABLE `proveedor_servicios`
  ADD PRIMARY KEY (`proveedor_id`,`servicio_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_servicio` (`nombre_servicio`),
  ADD KEY `fk_servicio_especialidad` (`especialidad_id`);

--
-- Indices de la tabla `tasas_cambio`
--
ALTER TABLE `tasas_cambio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fecha` (`fecha`);

--
-- Indices de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `proveedor_id` (`proveedor_id`),
  ADD KEY `servicio_id` (`servicio_id`),
  ADD KEY `idx_fecha_tratamiento` (`fecha_tratamiento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tasas_cambio`
--
ALTER TABLE `tasas_cambio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `fk_proveedor_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `proveedor_servicios`
--
ALTER TABLE `proveedor_servicios`
  ADD CONSTRAINT `proveedor_servicios_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proveedor_servicios_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `fk_servicio_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  ADD CONSTRAINT `tratamientos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `tratamientos_ibfk_2` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `tratamientos_ibfk_3` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
