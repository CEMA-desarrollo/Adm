# Proyecto: Sistema Integral de Gestión Financiera y Auditoría para Consultorios (SIGFAC)

## 1. Visión del Proyecto
Crear una aplicación web segura, centralizada y auditable para la gestión financiera de un consultorio. El sistema se especializará en el control de pagos de pacientes, manejo de múltiples monedas con tasas de cambio históricas, y un registro inmutable de todas las operaciones para garantizar la máxima transparencia y control administrativo.

## 2. Módulos y Funcionalidades

### A. Autenticación y Seguridad
- **Login de Usuarios:** Acceso por `nombre_usuario` y `contraseña` (hasheada).
- **Roles:**
    - `Admin`: Control total, gestiona catálogos, usuarios y bitácora.
    - `Recepcionista`: Operaciones diarias (gestión de pacientes, tratamientos, pagos).

### B. Gestión de Entidades
- **Pacientes:** CRUD básico de información de pacientes.
- **Proveedores:** Catálogo de profesionales (`Medico`, `Fisioterapeuta`, `Otro`) con su especialidad.
- **Servicios:** Catálogo de procedimientos con un `precio_sugerido_usd` editable solo por el `admin`.

### C. Módulo Financiero (Core)
- **Gestión de Tratamientos:** Registro de un servicio prestado por un proveedor a un paciente.
    - Guarda `costo_original_usd` (del catálogo) y `costo_final_acordado_usd` (editable, para descuentos).
    - Campo opcional `justificacion_descuento`.
    - Campo booleano para marcar como `Facturado`.
- **Registro de Pagos:**
    - Multimoneda (`USD`, `VES`) y multimétodo (`Efectivo`, `Transferencia`, `Zelle`, `Punto de Venta`).
    - Guarda la `tasa_cambio_aplicada` si el pago es en VES para un tratamiento en USD.
- **Gestión de Tasa de Cambio:**
    - Tabla `TasasDeCambio` para un histórico de la tasa del dólar.
    - Función para actualizar la tasa del día desde una API externa.

### D. Módulo de Auditoría (Bitácora)
- Registro automático de todas las acciones de creación, modificación y eliminación.
- Guarda `usuario_id`, `accion`, `tabla_afectada`, `registro_id_afectado`, `detalles` y `fecha`.
- Interfaz de consulta con filtros por **rango de fechas** y **usuario**.

## 3. Flujo de Trabajo Clave: "Crear Tratamiento"
1.  **Seleccionar Paciente:** La recepcionista busca y elige al paciente.
2.  **Validación de Saldo:** El sistema muestra automáticamente el estado de cuenta actual del paciente (saldo pendiente o a favor). Esto informa la conversación con el paciente.
3.  **Registrar Servicio:** La recepcionista selecciona al `Proveedor` y el `Servicio` del catálogo.
4.  **Ajustar Precio:** El sistema autocompleta el precio. La recepcionista puede editar el `costo_final_acordado_usd` si hay un descuento.
5.  **Guardar:** El sistema crea el registro del tratamiento. Si el paciente tenía saldo a favor y se acordó usarlo, el sistema crea un pago automático para cubrir parcial o totalmente el nuevo costo.

## 4. Estructura Final de la Base de Datos (MySQL)

```sql
CREATE DATABASE IF NOT EXISTS `consultorio_financiero_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

-- Tabla de proveedores de servicios (Médicos, Fisioterapeutas, etc.)
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
