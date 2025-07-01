-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-06-2025 a las 17:09:25
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
(46, 10, 'ACTUALIZACIÓN', 'servicios', 2, '{\"valor_anterior\":{\"id\":2,\"nombre_servicio\":\"Terapia\",\"precio_sugerido_usd\":\"15.00\",\"activo\":1,\"created_at\":\"2025-06-26T18:34:08.000Z\",\"updated_at\":\"2025-06-26T18:34:08.000Z\"},\"nuevo_valor\":{\"nombre_servicio\":\"Terapia y r\",\"precio_sugerido_usd\":\"15.00\"}}', '2025-06-26 14:48:33');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `documento_identidad`, `numero_historia`, `created_at`, `updated_at`) VALUES
(1, 'Juan', 'Perez', 'V-12345678', 'H-001', '2025-06-24 18:25:15', '2025-06-24 18:25:15'),
(2, 'Jose ', 'Fariña', 'V-19105204', 'H-002', '2025-06-26 10:05:17', '2025-06-26 10:05:17'),
(9, 'asdasd', 'asdasd', 'V-19105208', 'H-003', '2025-06-25 23:27:33', '2025-06-25 23:27:33'),
(10, 'aslala', 'papapa', 'V-19105258', 'H-004', '2025-06-25 19:29:55', '2025-06-25 19:29:55'),
(12, '12341g', '2345435', 'V-16464987', 'H-005', '2025-06-25 23:30:34', '2025-06-25 23:30:34');

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
  `especialidad` varchar(100) DEFAULT NULL,
  `tipo_proveedor` enum('Medico','Fisioterapeuta','Otro') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre_completo`, `especialidad`, `tipo_proveedor`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Jose Fariña', 'Traumatologo', 'Medico', 1, '2025-06-24 02:25:15', '2025-06-24 02:25:15'),
(2, 'Dr. Antonio Natale', 'Traumatologo', 'Medico', 1, '2025-06-26 13:46:00', '2025-06-26 13:46:00'),
(3, 'Blanca Antoneli', '', 'Fisioterapeuta', 1, '2025-06-26 17:46:27', '2025-06-26 17:46:27'),
(4, 'Betania Garcia', '', 'Fisioterapeuta', 1, '2025-06-26 21:59:49', '2025-06-26 21:59:49'),
(5, 'Dr. Nigmet Asis', 'Traumatologo', 'Medico', 1, '2025-06-26 14:02:57', '2025-06-26 14:02:57'),
(6, 'Samantha Pineda', '', 'Fisioterapeuta', 1, '2025-06-26 14:03:52', '2025-06-26 14:03:52'),
(7, 'Daniel Rivero', '', 'Fisioterapeuta', 1, '2025-06-26 14:04:28', '2025-06-26 14:04:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre_servicio` varchar(255) NOT NULL,
  `precio_sugerido_usd` decimal(12,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre_servicio`, `precio_sugerido_usd`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Consulta Traumatologica', 50.00, 1, '2025-06-23 22:25:15', '2025-06-26 14:12:37'),
(2, 'Terapia y r', 15.00, 1, '2025-06-26 22:34:08', '2025-06-26 22:34:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasas_de_cambio`
--

CREATE TABLE `tasas_de_cambio` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `tasa_ves_por_usd` decimal(18,4) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tasas_de_cambio`
--

INSERT INTO `tasas_de_cambio` (`id`, `fecha`, `tasa_ves_por_usd`, `fecha_registro`) VALUES
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
  `facturado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_tratamiento` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `hash_contrasena` varchar(255) NOT NULL,
  `rol` enum('admin','recepcionista') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `hash_contrasena`, `rol`, `activo`, `created_at`, `updated_at`) VALUES
(10, 'admin', '$2b$10$TWPIbiqlUIAiVfA4ZgTede/qn/xTp4GohwZLjyODvzAk8IPksb.aa', 'admin', 1, '2025-06-25 17:29:34', '2025-06-25 21:42:01');

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
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_servicio` (`nombre_servicio`);

--
-- Indices de la tabla `tasas_de_cambio`
--
ALTER TABLE `tasas_de_cambio`
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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tasas_de_cambio`
--
ALTER TABLE `tasas_de_cambio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
