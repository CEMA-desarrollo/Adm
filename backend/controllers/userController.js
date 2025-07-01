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

    // ADVERTENCIA DE SEGURIDAD: Comparación de contraseña en texto plano. NO USAR EN PRODUCCIÓN.
    const isMatch = password === user.hash_contrasena;

    if (!isMatch) {
      console.log(`[AUTH-ERROR] La contraseña para el usuario "${nombre_usuario}" no coincide.`);
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    console.log(`[AUTH-SUCCESS] Login exitoso para "${nombre_usuario}". Creando sesión.`);

    // Guardar información del usuario en la sesión
    req.session.user = {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      rol: user.rol,
    };

    // Devolver solo la información necesaria al cliente
    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol,
      },
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
    const { nombre_usuario, password, rol } = req.body;
    if (!nombre_usuario || !password || !rol) {
        return res.status(400).json({ message: 'Nombre de usuario, contraseña y rol son requeridos.' });
    }

    // SIN BCRYPT: Guardamos la contraseña directamente en el campo hash_contrasena
    const newUser = await User.create({ nombre_usuario, hash_contrasena: password, rol });
    
    // No devolver la contraseña en la respuesta
    const { hash_contrasena: _, ...userSinPassword } = newUser;

    // Registrar en la bitácora
    await Bitacora.create({
      usuario_id: req.session.user.id, // El ID del admin que realiza la acción
      accion: 'CREACIÓN',
      tabla_afectada: 'usuarios',
      registro_id_afectado: newUser.id,
      detalles: { nuevo_valor: userSinPassword }
    });

    console.log(`[USER-MGMT] Usuario "${nombre_usuario}" creado por "${req.session.user.nombre_usuario}".`);
    res.status(201).json(userSinPassword);
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
    const { nombre_usuario, rol, activo } = req.body;

    // Obtener el estado actual para la bitácora
    const valor_anterior = await User.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const updated = await User.update(id, { nombre_usuario, rol, activo });
    if (!updated) {
        // Esto es redundante si ya verificamos arriba, pero es una buena práctica
        return res.status(404).json({ message: 'Usuario no encontrado o sin cambios.' });
    }

    // Registrar en la bitácora
    await Bitacora.create({
      usuario_id: req.session.user.id,
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'usuarios',
      registro_id_afectado: id,
      detalles: { 
        valor_anterior: {
            nombre_usuario: valor_anterior.nombre_usuario,
            rol: valor_anterior.rol,
            activo: valor_anterior.activo
        },
        cambios: { nombre_usuario, rol, activo } 
      }
    });

    console.log(`[USER-MGMT] Usuario ID ${id} actualizado por "${req.session.user.nombre_usuario}".`);
    res.json({ message: 'Usuario actualizado con éxito.' });
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
    // Devolvemos solo los datos necesarios y seguros del usuario.
    // El frontend espera 'id', 'nombre_usuario' y 'rol'.
    const { id, nombre_usuario, rol } = req.session.user;
    return res.json({ id, nombre_usuario, rol });
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
