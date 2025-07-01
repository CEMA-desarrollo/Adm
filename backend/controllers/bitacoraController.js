const Bitacora = require('../models/bitacoraModel');

const getLogs = async (req, res) => {
  try {
    // Extraer filtros de la query string (ej: /api/bitacora?fecha_inicio=2024-01-01)
    const { fecha_inicio, fecha_fin, usuario_id } = req.query;
    
    const logs = await Bitacora.findAll({ fecha_inicio, fecha_fin, usuario_id });
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener registros de la bitácora:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getLogs
};