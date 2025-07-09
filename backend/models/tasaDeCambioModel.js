const dbPool = require('../config/db');

const TasaDeCambio = {
  async createOrUpdate({ fecha, tasa_bs_por_usd }) {
    const sql = `
      INSERT INTO tasas_de_cambio (fecha, tasa_bs_por_usd)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE tasa_bs_por_usd = VALUES(tasa_bs_por_usd)
    `;
    await dbPool.query(sql, [fecha, tasa_bs_por_usd]);
    // Después de insertar o actualizar, busca por fecha para devolver el objeto completo.
    return this.findByDate(fecha);
  },

  async findAll() {
    const [rows] = await dbPool.query('SELECT id, fecha, tasa_bs_por_usd, created_at, updated_at FROM tasas_de_cambio ORDER BY fecha DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await dbPool.query('SELECT id, fecha, tasa_bs_por_usd, created_at, updated_at FROM tasas_de_cambio WHERE id = ?', [id]);
    return rows[0];
  },

  async findByDate(fecha) {
    // Busca la tasa para una fecha específica.
    const [rows] = await dbPool.query('SELECT id, fecha, tasa_bs_por_usd, created_at, updated_at FROM tasas_de_cambio WHERE fecha = ?', [fecha]);
    return rows[0];
  },

  async findLatest() {
    // Busca la tasa más reciente.
    const [rows] = await dbPool.query('SELECT id, fecha, tasa_bs_por_usd, created_at, updated_at FROM tasas_de_cambio ORDER BY fecha DESC LIMIT 1');
    return rows[0];
  }
};

module.exports = TasaDeCambio;
