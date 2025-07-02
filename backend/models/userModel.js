// userModel.js
const dbPool = require('../config/db');

class User {
  /**
   * Busca un usuario por su nombre de usuario.
   * @param {string} username - El nombre de usuario a buscar.
   * @returns {Promise<object|undefined>} El objeto de usuario o undefined si no se encuentra.
   */
  static async findByUsername(username) {
    const [rows] = await dbPool.execute('SELECT id, nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, password, rol, activo FROM usuarios WHERE nombre_usuario = ?', [username]);
    return rows[0];
  }

  /**
   * Devuelve todos los usuarios.
   * @returns {Promise<Array<object>>} Un array de objetos de usuario.
   */
  static async findAll() {
    // Excluimos el password por seguridad en listados generales.
    const [rows] = await dbPool.execute('SELECT id, nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, rol, activo, created_at, updated_at FROM usuarios');
    return rows;
  }

  /**
   * Busca un usuario por su ID.
   * @param {number} id - El ID del usuario.
   * @returns {Promise<object|undefined>} El objeto de usuario o undefined si no se encuentra.
   */
  static async findById(id) {
    // Devuelve todos los campos excepto el password para operaciones internas (o para mostrar perfil).
    const [rows] = await dbPool.execute('SELECT id, nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, rol, activo FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Crea un nuevo usuario.
   * @param {object} newUserData - Datos del nuevo usuario.
   * @returns {Promise<object>} El objeto del nuevo usuario creado, sin la contraseña.
   */
  static async create(newUserData) {
    const { nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, password, rol } = newUserData;
    const [result] = await dbPool.execute(
      'INSERT INTO usuarios (nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, password, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [nombre_usuario, nombre, apellido, fecha_nacimiento, url_imagen, password, rol]
    );
    // Devolvemos el nuevo usuario sin la contraseña por seguridad.
    const { password: _, ...userSinPassword } = newUserData;
    return { id: result.insertId, ...userSinPassword, activo: 1 }; // activo is 1 by default
  }

  /**
   * Actualiza los datos de un usuario (sin incluir la contraseña).
   * @param {number} id - El ID del usuario a actualizar.
   * @param {object} userData - Datos a actualizar.
   * @returns {Promise<boolean>} True si se actualizó, false en caso contrario.
   */
  static async update(id, userData) {
    // Construimos dinámicamente la query para actualizar solo los campos provistos
    const fields = [];
    const values = [];

    // Campos permitidos para actualización (excluyendo id, password, created_at, updated_at)
    // Password updates should be handled by a separate, dedicated function if needed.
    const allowedFields = ['nombre_usuario', 'nombre', 'apellido', 'fecha_nacimiento', 'url_imagen', 'rol', 'activo'];

    for (const key in userData) {
      if (userData[key] !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    }

    if (fields.length === 0) {
      return false; // No fields to update
    }

    values.push(id); // for WHERE id = ?

    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await dbPool.execute(sql, values);
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
