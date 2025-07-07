// userController.js
const User = require('../models/userModel');
const Bitacora = require('../models/bitacoraModel');

// --- Funciones del Controlador ---

/**
 * @summary Inicia sesión de un usuario.
 * @description ADVERTENCIA: Este método compara contraseñas en TEXTO PLANO.
 * Esto es una mala práctica de seguridad y solo debe usarse en entornos de desarrollo.
 * En producción, SIEMPRE se debe usar una biblioteca como bcrypt para hashear y verificar contraseñas.
 */
async function login(req, res) {
  try {
    const { nombre_usuario, password } = req.body;
    if (!nombre_usuario || !password) {
      return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }
    console.log(`[AUTH] Intento de login para el usuario: "${nombre_usuario}"`);

    const user = await User.findByUsername(nombre_usuario);

    if (!user || !user.activo) {
      console.log(`[AUTH-ERROR] Usuario "${nombre_usuario}" no encontrado o inactivo.`);
      return res.status(401).json({ message: 'Credenciales inválidas o usuario inactivo.' });
    }
    console.log(`[AUTH] Usuario "${nombre_usuario}" encontrado. Rol: ${user.rol}. Verificando contraseña...`);

    // Comparación de contraseña en texto plano.
    const isMatch = password === user.password; // Changed from user.hash_contrasena

    if (!isMatch) {
      console.log(`[AUTH-ERROR] La contraseña para el usuario "${nombre_usuario}" no coincide.`);
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    console.log(`[AUTH-SUCCESS] Login exitoso para "${nombre_usuario}". Creando sesión.`);

    // Guardar información del usuario en la sesión
    // user object from model now has 'password' field instead of 'hash_contrasena'
    const { password: _, ...sessionUser } = user; // Exclude password from session
    req.session.user = sessionUser;

    // Devolver la información del usuario al cliente (sin contraseña)
    // sessionUser already excludes the password
    res.json({
      message: 'Login exitoso',
      user: sessionUser,
    });
  } catch (error) {
    console.error(`[AUTH-FATAL] Error inesperado en el proceso de login:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

function logout(req, res) {
  const user = req.session.user;
  const username = user ? user.nombre_usuario : 'desconocido';
  console.log(`[AUTH] Intento de logout para el usuario: "${username}"`);

  req.session.destroy((err) => {
    if (err) {
      console.error(`[AUTH-FATAL] Error al destruir la sesión para "${username}":`, err);
      return res.status(500).json({ message: 'Error al cerrar sesión.' });
    }
    // Limpiar la cookie del lado del cliente
    res.clearCookie('connect.sid'); // El nombre de la cookie puede variar según tu configuración de express-session
    console.log(`[AUTH-SUCCESS] Sesión cerrada con éxito para "${username}".`);
    res.status(200).json({ message: 'Sesión cerrada con éxito.' });
  });
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios.', error: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { nombre_usuario, password, rol, nombre, apellido, fecha_nacimiento, url_imagen } = req.body;
    if (!nombre_usuario || !password || !rol || !nombre || !apellido) { // nombre y apellido son ahora requeridos
        return res.status(400).json({ message: 'Nombre de usuario, contraseña, rol, nombre y apellido son requeridos.' });
    }

    // Validate the 'rol' field against the new allowed roles
    const allowedRoles = ['Administrador', 'Encargado', 'Recepción', 'Propietario'];
    if (!allowedRoles.includes(rol)) {
        return res.status(400).json({ message: `Rol inválido. Los roles permitidos son: ${allowedRoles.join(', ')}.` });
    }

    const createData = {
        nombre_usuario,
        password: password, // Changed from hash_contrasena
        rol,
        nombre,
        apellido,
        fecha_nacimiento: fecha_nacimiento || null, // opcional
        url_imagen: url_imagen || null // opcional
    };

    const newUser = await User.create(createData);
    
    // newUser already excludes password due to model logic.

    // Registrar en la bitácora
    await Bitacora.create({
      usuario_id: req.session.user.id, // El ID del admin que realiza la acción
      accion: 'CREACIÓN',
      tabla_afectada: 'usuarios',
      registro_id_afectado: newUser.id,
      detalles: { nuevo_valor: newUser } // newUser ya está limpio de contraseña
    });

    console.log(`[USER-MGMT] Usuario "${nombre_usuario}" creado por "${req.session.user.nombre_usuario}".`);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    // Manejar error de usuario duplicado
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: `El nombre de usuario '${req.body.nombre_usuario}' ya existe.` });
    }
    res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    // Extract all possible fields from body, including new ones
    const { nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, rol, activo } = req.body;

    const updateData = {};
    if (nombre_usuario !== undefined) updateData.nombre_usuario = nombre_usuario;
    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellido !== undefined) updateData.apellido = apellido;
    if (fecha_nacimiento !== undefined) updateData.fecha_nacimiento = fecha_nacimiento || null; // Allow setting to null
    if (url_imagen !== undefined) updateData.url_imagen = url_imagen || null; // Allow setting to null
    if (rol !== undefined) updateData.rol = rol;
    if (activo !== undefined) updateData.activo = activo;


    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    // Validar que si nombre o apellido se envían, no sean vacíos (si son obligatorios)
    if (updateData.nombre === '') return res.status(400).json({ message: 'El nombre no puede ser vacío.' });
    if (updateData.apellido === '') return res.status(400).json({ message: 'El apellido no puede ser vacío.' });

    // Validate the 'rol' field if it's being updated
    if (updateData.rol) {
        const allowedRoles = ['Administrador', 'Encargado', 'Recepción', 'Propietario'];
        if (!allowedRoles.includes(updateData.rol)) {
            return res.status(400).json({ message: `Rol inválido. Los roles permitidos son: ${allowedRoles.join(', ')}.` });
        }
    }

    // Obtener el estado actual para la bitácora
    const valor_anterior = await User.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const updated = await User.update(id, updateData);
    if (!updated) {
        return res.status(404).json({ message: 'Usuario no encontrado o sin cambios.' });
    }

    // Para la bitácora, construimos el objeto valor_anterior con todos los campos relevantes
    const valorAnteriorParaBitacora = {
        nombre_usuario: valor_anterior.nombre_usuario,
        nombre: valor_anterior.nombre,
        apellido: valor_anterior.apellido,
        fecha_nacimiento: valor_anterior.fecha_nacimiento,
        url_imagen: valor_anterior.url_imagen,
        rol: valor_anterior.rol,
        activo: valor_anterior.activo
    };

    // Registrar en la bitácora
    await Bitacora.create({
      usuario_id: req.session.user.id,
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'usuarios',
      registro_id_afectado: id,
      detalles: { 
        valor_anterior: valorAnteriorParaBitacora,
        cambios: updateData // Log only the changes sent
      }
    });

    console.log(`[USER-MGMT] Usuario ID ${id} actualizado por "${req.session.user.nombre_usuario}".`);
    // Devolver el usuario actualizado (sin contraseña)
    const usuarioActualizado = await User.findById(id); // Re-fetch to get the complete updated record
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(`Error al actualizar el usuario ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Obtener el estado actual para la bitácora
    const valor_anterior = await User.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const deleted = await User.remove(id);
    if (!deleted) {
        // Esto es redundante si ya verificamos arriba, pero es una buena práctica
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Registrar en la bitácora
    await Bitacora.create({
      usuario_id: req.session.user.id,
      accion: 'ELIMINACIÓN',
      tabla_afectada: 'usuarios',
      registro_id_afectado: id,
      detalles: { valor_eliminado: valor_anterior }
    });

    console.log(`[USER-MGMT] Usuario ID ${id} eliminado por "${req.session.user.nombre_usuario}".`);
    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error(`Error al eliminar el usuario ${req.params.id}:`, error);
    // El modelo ya previene la eliminación del admin, pero podemos manejar el error aquí
    if (error.message.includes('administrador principal')) {
        return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar el usuario.', error: error.message });
  }
}

// NUEVO: Controlador para OBTENER PERFIL DE USUARIO
const getProfile = (req, res) => {
  // Si el middleware 'isAuthenticated' pasó, la información del usuario está en la sesión.
  if (req.session.user) {
    // Devolvemos todos los datos del usuario guardados en la sesión.
    // El modelo User.findByUsername ya selecciona todos los campos necesarios (excepto contraseña).
    // Y la función login ya los guarda en req.session.user.
    res.json({ user: req.session.user });
  } else {
    // Esto es una salvaguarda, el middleware ya debería haberlo prevenido.
    return res.status(401).json({ message: 'No autorizado: No hay sesión activa.' });
  }
};

// Exportamos todas las funciones en un solo objeto
module.exports = {
  login,
  logout,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  // Nueva función para actualizar el perfil del usuario
  async updateProfile(req, res) {
    try {
      const userId = req.session.user.id; // ID del usuario autenticado
      const { nombre, apellido, fecha_nacimiento } = req.body;

      // 1. Validar campos obligatorios
      if (!nombre || !apellido) {
        // Si hay un archivo subido y hay error de validación, eliminar el archivo temporal.
        if (req.file) {
          const fs = require('fs').promises;
          await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo temporal tras validación fallida:", err));
        }
        return res.status(400).json({ message: 'Los campos nombre y apellido son obligatorios.' });
      }

      const updateData = {
        nombre,
        apellido,
      };

      if (fecha_nacimiento) {
        // Validar formato YYYY-MM-DD (simple validación, se puede mejorar con librerías)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
          if (req.file) {
            const fs = require('fs').promises;
            await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo temporal tras validación de fecha fallida:", err));
          }
          return res.status(400).json({ message: 'El formato de fecha_nacimiento debe ser YYYY-MM-DD.' });
        }
        updateData.fecha_nacimiento = fecha_nacimiento;
      } else {
        // Si se envía vacío, permitir establecerlo a null si la BD lo permite
        updateData.fecha_nacimiento = null;
      }

      let oldAvatarPath = null; // Para guardar la ruta del avatar anterior si se va a eliminar

      // 2. Procesar archivo de avatar (si existe)
      if (req.file) {
        const fs = require('fs').promises;
        const path = require('path');

        // Obtener el usuario actual para saber si tiene un avatar anterior
        const currentUser = await User.findById(userId);
        if (currentUser && currentUser.url_imagen) {
            // Construir la ruta completa en el sistema de archivos del avatar anterior
            // Asumiendo que url_imagen guarda algo como /public/uploads/avatars/user-1-timestamp.jpg
            // y que el servidor está sirviendo 'public' desde 'backend/public'
            oldAvatarPath = path.join(__dirname, '..', currentUser.url_imagen);
        }

        const timestamp = Date.now();
        const extension = path.extname(req.file.originalname);
        const newFilename = `user-${userId}-${timestamp}${extension}`;
        const newFilePath = path.join(path.dirname(req.file.path), newFilename);

        try {
          await fs.rename(req.file.path, newFilePath);
          updateData.url_imagen = `/public/uploads/avatars/${newFilename}`; // URL pública
        } catch (renameError) {
          console.error('Error al renombrar el archivo avatar:', renameError);
          // No eliminamos el archivo temporal aquí, ya que el error es al renombrar.
          // Podría ser un problema de permisos o similar.
          return res.status(500).json({ message: 'Error al procesar la imagen de perfil.' });
        }
      }

      // 3. Actualizar base de datos
      const updated = await User.update(userId, updateData);

      if (!updated) {
        // Si hay un archivo nuevo y la actualización falla, eliminar el archivo nuevo (ya renombrado).
        if (req.file && updateData.url_imagen) {
            const fs = require('fs').promises;
            const path = require('path');
            const newAvatarPath = path.join(__dirname, '..', updateData.url_imagen);
            await fs.unlink(newAvatarPath).catch(err => console.error("Error al eliminar nuevo avatar tras fallo de actualización de BD:", err));
        }
        return res.status(500).json({ message: 'No se pudo actualizar el perfil.' });
      }

      // 4. Si se subió un nuevo avatar y había uno antiguo, eliminar el antiguo.
      if (oldAvatarPath && updateData.url_imagen && oldAvatarPath !== path.join(__dirname, '..', updateData.url_imagen)) {
          const fs = require('fs').promises;
          console.log(`[INFO] Eliminando avatar antiguo: ${oldAvatarPath}`);
          await fs.unlink(oldAvatarPath).catch(err => {
              // Loggear el error pero no hacer que la solicitud falle por esto,
              // ya que el perfil ya se actualizó.
              console.error("Error al eliminar el avatar antiguo:", err);
          });
      }

      // 5. Obtener datos actualizados del usuario
      const usuarioActualizado = await User.findById(userId);

      // Actualizar la sesión del usuario con los nuevos datos
      // (excluyendo la contraseña, findById ya lo hace)
      req.session.user = usuarioActualizado;

      // 6. Enviar Respuesta
      res.json({
        message: 'Perfil actualizado con éxito',
        user: usuarioActualizado,
      });

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      // Si hay un archivo subido y ocurre un error no manejado, intentar eliminarlo.
      if (req.file) {
        const fs = require('fs').promises;
        // req.file.path sería el nombre temporal si no se renombró,
        // o el nuevo nombre si el error ocurrió después del renombramiento.
        // Es difícil saberlo con certeza aquí sin más contexto del error.
        // Por seguridad, intentamos eliminar req.file.path (ruta original de multer).
        await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo temporal en catch general:", err));
      }
      // Manejo de errores de Multer (ej. archivo muy grande, tipo de archivo incorrecto)
      if (error instanceof require('multer').MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 5MB.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
             // Este mensaje viene de nuestro filtro personalizado
            return res.status(400).json({ message: error.message || 'Tipo de archivo no permitido.' });
        }
        return res.status(400).json({ message: `Error al subir archivo: ${error.message}` });
      }
      res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.' });
    }
  }
};

const isAuthenticated = (req, res, next) => {
  console.log('[SESSION_DEBUG] req.session:', req.session);
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión.' });
};
