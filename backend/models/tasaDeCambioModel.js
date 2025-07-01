const dbPool = require('../config/db');

const TasaDeCambio = {
  async create(data) {
    const [result] = await dbPool.query('INSERT INTO tasas_de_cambio SET ?', [data]);
    // Corregido: no desestructurar como array
    const tasa = await this.findById(result.insertId);
    return tasa;
  },

  async findAll() {
    const [rows] = await dbPool.query('SELECT * FROM tasas_de_cambio ORDER BY fecha DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query('SELECT * FROM tasas_de_cambio WHERE id = ?', [id]);
    return rows[0];
  },

  async findByDate(fecha) {
    // Busca la tasa para una fecha específica.
    const [rows] = await dbPool.query('SELECT * FROM tasas_de_cambio WHERE fecha = ?', [fecha]);
    return rows[0];
  },

  async findLatest() {
    // Busca la tasa más reciente.
    const [rows] = await dbPool.query('SELECT * FROM tasas_de_cambio ORDER BY fecha DESC LIMIT 1');
    return rows[0];
  }
};

module.exports = TasaDeCambio;
