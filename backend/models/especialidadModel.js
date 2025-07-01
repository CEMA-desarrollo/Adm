const dbPool = require('../config/db');

const Especialidad = {
  async create(data) {
    const [result] = await dbPool.query('INSERT INTO especialidades SET ?', [data]);
    const especialidad = await this.findById(result.insertId);
    return especialidad;
  },

  async findAll(soloActivos = false) {
    let query = 'SELECT * FROM especialidades';
    if (soloActivos) {
      query += ' WHERE activo = 1';
    }
    const [rows] = await dbPool.query(query);
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query('SELECT * FROM especialidades WHERE id = ?', [id]); // Busca por ID sin importar el estado
    return rows[0];
  },

  async findByName(nombre) {
    const [rows] = await dbPool.query('SELECT * FROM especialidades WHERE nombre = ?', [nombre]);
    return rows[0];
  },

  async update(id, data) {
    // Omitimos campos que no deben ser actualizados para evitar errores.
    const dataToUpdate = { ...data };
    delete dataToUpdate.id;
    delete dataToUpdate.created_at;
    delete dataToUpdate.updated_at;

    const [result] = await dbPool.query('UPDATE especialidades SET ? WHERE id = ?', [dataToUpdate, id]);
    // Después de actualizar, devolvemos el objeto completo para consistencia.
    if (result.affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  },

  // Para la eliminación lógica, actualizamos el campo 'activo'
  async delete(id) {
    const [result] = await dbPool.query('UPDATE especialidades SET activo = 0 WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Especialidad;