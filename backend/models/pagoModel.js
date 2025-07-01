const dbPool = require('../config/db');

const Pago = {
  async create(pagoData) {
    const [result] = await dbPool.query('INSERT INTO pagos SET ?', [pagoData]);
    const pago = await this.findById(result.insertId); // Corregido: no desestructurar como array
    return pago;
  },

  async findAll() {
    const [rows] = await dbPool.query('SELECT * FROM pagos');
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query('SELECT * FROM pagos WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, pagoData) {
    const [result] = await dbPool.query('UPDATE pagos SET ? WHERE id = ?', [pagoData, id]);
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await dbPool.query('DELETE FROM pagos WHERE id = ?', [id]);
    return result.affectedRows;
  },

  async findByPatientId(pacienteId) {
    const [rows] = await dbPool.query('SELECT * FROM pagos WHERE paciente_id = ?', [pacienteId]);
    return rows;
  }
};

module.exports = Pago;