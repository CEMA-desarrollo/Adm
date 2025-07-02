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
    return res.json(req.session.user);
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
  getProfile, // <-- ¡AÑADIR ESTA LÍNEA ES CRUCIAL!
};
