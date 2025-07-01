const db = require('../config/db');

const Servicio = {
  /**
   * Encuentra todos los servicios. Incluye el nombre de la especialidad.
   * @param {object} options - Opciones para filtrar, ej: { where: { activo: 1 } }
   */
  async findAll(options = {}) {
    let query = 'SELECT s.*, e.nombre as especialidad_nombre FROM servicios s LEFT JOIN especialidades e ON s.especialidad_id = e.id';
    const params = [];
    if (options.where && options.where.activo !== undefined) {
      query += ' WHERE s.activo = ?';
      params.push(options.where.activo);
    }
    query += ' ORDER BY s.nombre_servicio ASC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  /**
   * Encuentra un servicio por su ID.
   */
  async findById(id) {
    const [rows] = await db.query('SELECT s.*, e.nombre as especialidad_nombre FROM servicios s LEFT JOIN especialidades e ON s.especialidad_id = e.id WHERE s.id = ?', [id]);
    return rows[0];
  },

  /**
   * Crea un nuevo servicio en la base de datos.
   */
  async create(data) {
    const { nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion } = data;
    const [result] = await db.query(
      'INSERT INTO servicios (nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion) VALUES (?, ?, ?, ?)',
      [nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion]
    );
    const id = result.insertId;
    return { id, ...data };
  },

  /**
   * Actualiza un servicio existente por su ID.
   */
  async update(id, data) {
    const { nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion, activo } = data;
    const [result] = await db.query(
      'UPDATE servicios SET nombre_servicio = ?, precio_sugerido_usd = ?, especialidad_id = ?, descripcion = ?, activo = ? WHERE id = ?',
      [nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion, activo, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Realiza un borrado lógico de un servicio, poniéndolo como inactivo.
   */
  async remove(id) {
    const [result] = await db.query('UPDATE servicios SET activo = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Realiza un borrado FÍSICO de un servicio. ¡Esta acción es irreversible!
   */
  async deletePermanent(id) {
    const [result] = await db.query('DELETE FROM servicios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Servicio;
