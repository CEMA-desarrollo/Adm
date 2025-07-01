const dbPool = require('../config/db');

const Paciente = {
  async create(data) {
    const [result] = await dbPool.query('INSERT INTO pacientes SET ?', [data]);
    // Corregido: no desestructurar como array
    const paciente = await this.findById(result.insertId);
    return paciente;
  },

  async findAll() {
    const [rows] = await dbPool.query('SELECT * FROM pacientes');
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
    const [result] = await dbPool.query('DELETE FROM pacientes WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Paciente;
