const dbPool = require('../config/db');

const Bitacora = {
  create: async (logData) => {
    const { usuario_id, accion, tabla_afectada, registro_id_afectado, detalles } = logData;
    const query = `
      INSERT INTO bitacora (usuario_id, accion, tabla_afectada, registro_id_afectado, detalles) 
      VALUES (?, ?, ?, ?, ?)
    `;
    // El objeto 'detalles' se convierte a string para guardarlo en la columna JSON
    await dbPool.query(query, [usuario_id, accion, tabla_afectada, registro_id_afectado, JSON.stringify(detalles)]);
  },

  findAll: async ({ fecha_inicio, fecha_fin, usuario_id }) => {
    let query = `
      SELECT 
        b.id, b.fecha, b.accion, b.tabla_afectada, 
        b.registro_id_afectado, b.detalles, u.nombre_usuario 
      FROM bitacora b
      LEFT JOIN usuarios u ON b.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (fecha_inicio) {
      query += ' AND DATE(b.fecha) >= ?';
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      query += ' AND DATE(b.fecha) <= ?';
      params.push(fecha_fin);
    }
    if (usuario_id) {
      query += ' AND b.usuario_id = ?';
      params.push(usuario_id);
    }

    query += ' ORDER BY b.fecha DESC';

    const [rows] = await dbPool.query(query, params);
    return rows;
  }
};

module.exports = Bitacora;