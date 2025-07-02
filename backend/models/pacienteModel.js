const dbPool = require('../config/db');

const Paciente = {
  async create(data) {
    const [result] = await dbPool.query('INSERT INTO pacientes SET ?', [data]);
    // Corregido: no desestructurar como array
    const paciente = await this.findById(result.insertId);
    return paciente;
  },

  async findAll(options = {}) { // Add options parameter
    let query = 'SELECT * FROM pacientes';
    const queryParams = [];
    if (options.where && options.where.activo !== undefined) {
      query += ' WHERE activo = ?';
      queryParams.push(options.where.activo);
    }
    query += ' ORDER BY apellido, nombre ASC'; // Optional: add default sorting
    const [rows] = await dbPool.query(query, queryParams);
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, data) {
    const [result] = await dbPool.query('UPDATE pacientes SET ? WHERE id = ?', [data, id]);
    return result.affectedRows;
  },

  async delete(id) {
    // This is a hard delete, currently unused by the controller for patient "deletion" which uses soft delete.
    const [result] = await dbPool.query('DELETE FROM pacientes WHERE id = ?', [id]);
    return result.affectedRows;
  },

  async search(searchTerm, options = {}) {
    let query = `
      SELECT * FROM pacientes
      WHERE (
        LOWER(nombre) LIKE LOWER(?) OR
        LOWER(apellido) LIKE LOWER(?) OR
        LOWER(documento_identidad) LIKE LOWER(?) OR
        LOWER(numero_historia) LIKE LOWER(?)
      )
    `;
    // Using LOWER() for case-insensitive search
    const queryParams = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ];

    if (options.activo !== undefined) {
      query += ' AND activo = ?';
      queryParams.push(options.activo);
    }
    query += ' ORDER BY apellido, nombre ASC';
    const [rows] = await dbPool.query(query, queryParams);
    return rows;
  }
};

module.exports = Paciente;
