const dbPool = require('../config/db');

const omit = (obj, keys) => {
  const newObj = { ...obj };
  keys.forEach(key => delete newObj[key]);
  return newObj;
};

const Proveedor = {
  async create(data) {
    const [result] = await dbPool.query('INSERT INTO proveedores SET ?', [data]);
    // Corregido: no desestructurar como array
    const proveedor = await this.findById(result.insertId);
    return proveedor;
  },

  async findAll() {
    const [rows] = await dbPool.query(`
      SELECT p.*, e.nombre AS especialidad_nombre
      FROM proveedores p
      LEFT JOIN especialidades e ON p.especialidad_id = e.id
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query(`
      SELECT p.*, e.nombre AS especialidad_nombre
      FROM proveedores p
      LEFT JOIN especialidades e ON p.especialidad_id = e.id
      WHERE p.id = ?`, [id]);
    return rows[0];
  },

  async update(id, data) {
    // Eliminamos campos que no existen en la tabla para evitar errores SQL.
    const dataToUpdate = omit(data, ['id', 'especialidad_nombre', 'created_at', 'updated_at']);
    const [result] = await dbPool.query('UPDATE proveedores SET ? WHERE id = ?', [dataToUpdate, id]);
    // Después de actualizar, volvemos a buscar el proveedor para devolver el objeto completo.
    if (result.affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  },

  async delete(id) {
    // Cambiado a eliminación lógica (soft delete) para desactivar en lugar de borrar.
    const [result] = await dbPool.query('UPDATE proveedores SET activo = 0 WHERE id = ?', [id]);
    return result.affectedRows;
  },

  /**
   * Realiza un borrado FÍSICO de un proveedor. ¡Esta acción es irreversible!
   */
  async deletePermanent(id) {
    const [result] = await dbPool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Proveedor;
