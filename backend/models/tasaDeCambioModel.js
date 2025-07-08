const db = require('../config/db');

const TasaCambio = {
  create: async (tasaData) => {
    const { fecha, tasa_bs_por_usd } = tasaData;
    const [result] = await db.execute(
      'INSERT INTO tasas_cambio (fecha, tasa_bs_por_usd) VALUES (?, ?)',
      [fecha, tasa_bs_por_usd]
    );
    return { id: result.insertId, ...tasaData };
  },

  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM tasas_cambio ORDER BY fecha DESC');
    return rows;
  },

  findByDate: async (fecha) => {
    const [rows] = await db.execute('SELECT * FROM tasas_cambio WHERE fecha = ?', [fecha]);
    return rows[0];
  }
};

module.exports = TasaCambio;