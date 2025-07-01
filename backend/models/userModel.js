// userModel.js
const dbPool = require('../config/db');

class User {
  /**
   * Busca un usuario por su nombre de usuario.
   * @param {string} username - El nombre de usuario a buscar.
   * @returns {Promise<object|undefined>} El objeto de usuario o undefined si no se encuentra.
   */
  static async findByUsername(username) {
    const [rows] = await dbPool.execute('SELECT * FROM usuarios WHERE nombre_usuario = ?', [username]);
    return rows[0];
  }

  /**
   * Devuelve todos los usuarios.
   * @returns {Promise<Array<object>>} Un array de objetos de usuario.
   */
  static async findAll() {
    // Excluimos el hash de la contraseña por seguridad en listados generales.
    const [rows] = await dbPool.execute('SELECT id, nombre_usuario, rol, activo, created_at, updated_at FROM usuarios');
    return rows;
  }

  /**
   * Busca un usuario por su ID.
   * @param {number} id - El ID del usuario.
   * @returns {Promise<object|undefined>} El objeto de usuario o undefined si no se encuentra.
   */
  static async findById(id) {
    // Devuelve todos los campos excepto la contraseña para operaciones internas.
    const [rows] = await dbPool.execute('SELECT id, nombre_usuario, rol, activo FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Crea un nuevo usuario.
   * La contraseña se guarda en texto plano directamente.
   * @param {object} newUser - Datos del nuevo usuario { nombre_usuario, hash_contrasena, rol }.
   * @returns {Promise<object>} El objeto del nuevo usuario creado, sin la contraseña.
   */
  static async create(newUser) {
    const { nombre_usuario, hash_contrasena, rol } = newUser;
    // ADVERTENCIA: Se guarda la contraseña en texto plano.
    const [result] = await dbPool.execute(
      'INSERT INTO usuarios (nombre_usuario, hash_contrasena, rol, activo) VALUES (?, ?, ?, 1)',
      [nombre_usuario, hash_contrasena, rol]
    );
    // Devolvemos el nuevo usuario sin la contraseña por seguridad.
    const { hash_contrasena: _, ...userSinPassword } = newUser;
    return { id: result.insertId, ...userSinPassword };
  }

  /**
   * Actualiza los datos de un usuario (sin incluir la contraseña).
   * @param {number} id - El ID del usuario a actualizar.
   * @param {object} userData - Datos a actualizar { nombre_usuario, rol, activo }.
   * @returns {Promise<boolean>} True si se actualizó, false en caso contrario.
   */
  static async update(id, userData) {
    const { nombre_usuario, rol, activo } = userData;
    // Nota: La actualización de contraseña se manejaría por separado.
    const [result] = await dbPool.execute(
      'UPDATE usuarios SET nombre_usuario = ?, rol = ?, activo = ? WHERE id = ?',
      [nombre_usuario, rol, activo, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Elimina un usuario de la base de datos.
   * @param {number} id - El ID del usuario a eliminar.
   * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
   */
  static async remove(id) {
    // Previene que el usuario admin principal (ID 1) se elimine.
    if (parseInt(id, 10) === 1) {
      throw new Error('No se puede eliminar al administrador principal.');
    }
    const [result] = await dbPool.execute(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
