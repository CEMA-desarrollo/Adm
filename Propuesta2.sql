-- Elimina la base de datos si existe (¡esto borrará todos tus datos actuales!)
DROP DATABASE IF EXISTS `consultorio_financiero_db`;

-- Vuelve a crear la base de datos
CREATE DATABASE IF NOT EXISTS `consultorio_financiero_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Selecciona la base de datos para usarla
USE `consultorio_financiero_db`;

-- Tabla de usuarios del sistema
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_usuario` VARCHAR(50) UNIQUE NOT NULL,
  `hash_contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'recepcionista') NOT NULL,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de proveedores de servicios (Médicos, Fisioterapeuta, etc.)
CREATE TABLE `proveedores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_completo` VARCHAR(200) NOT NULL,
  `especialidad` VARCHAR(100),
  `tipo_proveedor` ENUM('Medico', 'Fisioterapeuta', 'Otro') NOT NULL,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de pacientes
CREATE TABLE `pacientes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `documento_identidad` VARCHAR(20) UNIQUE NOT NULL,
  `numero_historia` VARCHAR(25) UNIQUE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Catálogo de servicios con precios base
CREATE TABLE `servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_servicio` VARCHAR(255) NOT NULL UNIQUE,
  `precio_sugerido_usd` DECIMAL(12, 2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Histórico de tasas de cambio
CREATE TABLE `tasas_de_cambio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATE NOT NULL UNIQUE,
  `tasa_ves_por_usd` DECIMAL(18, 4) NOT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de tratamientos
CREATE TABLE `tratamientos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `paciente_id` INT NOT NULL,
  `proveedor_id` INT NOT NULL,
  `servicio_id` INT NOT NULL,
  `descripcion_adicional` TEXT,
  `costo_original_usd` DECIMAL(12, 2) NOT NULL,
  `costo_final_acordado_usd` DECIMAL(12, 2) NOT NULL,
  `justificacion_descuento` TEXT,
  `facturado` BOOLEAN NOT NULL DEFAULT FALSE,
  `fecha_tratamiento` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT,
  INDEX `idx_fecha_tratamiento` (`fecha_tratamiento`)
) ENGINE=InnoDB;

-- Tabla de pagos
-- Se añade paciente_id y se hace tratamiento_id NULABLE para permitir pagos por adelantado (saldo a favor).
CREATE TABLE `pagos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `paciente_id` INT NOT NULL,
  `tratamiento_id` INT NULL,
  `usuario_id` INT NOT NULL,
  `monto` DECIMAL(12, 2) NOT NULL,
  `moneda_pago` ENUM('USD', 'VES') NOT NULL,
  `metodo_pago` ENUM('Efectivo', 'Transferencia', 'Zelle', 'Punto de Venta') NOT NULL,
  `tasa_cambio_aplicada` DECIMAL(18, 4) NULL,
  `referencia_pago` VARCHAR(255) NULL,
  `fecha_pago` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT,
  INDEX `idx_fecha_pago` (`fecha_pago`)
) ENGINE=InnoDB;

-- Tabla de bitácora
CREATE TABLE `bitacora` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL,
  `accion` VARCHAR(255) NOT NULL,
  `tabla_afectada` VARCHAR(50),
  `registro_id_afectado` INT,
  `detalles` JSON,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL,
  INDEX `idx_fecha` (`fecha`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_tabla_afectada` (`tabla_afectada`)
) ENGINE=InnoDB;
