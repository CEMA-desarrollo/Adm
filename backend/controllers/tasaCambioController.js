const TasaCambio = require('../models/tasaCambioModel');
const Bitacora = require('../models/bitacoraModel');

const getAllTasas = async (req, res) => {
  try {
    const tasas = await TasaCambio.findAll();
    res.json(tasas);
  } catch (error) {
    console.error('Error al obtener las tasas de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createTasa = async (req, res) => {
  try {
    const { fecha, tasa_bs_por_usd } = req.body;

    if (!fecha || !tasa_bs_por_usd) {
      return res.status(400).json({ message: 'La fecha y la tasa son obligatorias.' });
    }

    const tasaExistente = await TasaCambio.findByDate(fecha);
    if (tasaExistente) {
      return res.status(409).json({ message: 'Ya existe una tasa registrada para esta fecha.' });
    }

    const nuevaTasa = await TasaCambio.create({ fecha, tasa_bs_por_usd });

    // --- Registro en Bitácora ---
    if (req.session && req.session.user) {
        await Bitacora.create({
            usuario_id: req.session.user.id,
            accion: 'CREACIÓN',
            tabla_afectada: 'tasas_cambio',
            registro_id_afectado: nuevaTasa.id,
            detalles: { nuevo_valor: nuevaTasa }
        });
    }
    // --- Fin Registro en Bitácora ---

    res.status(201).json(nuevaTasa);
  } catch (error) {
    console.error('Error al crear la tasa de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllTasas,
  createTasa,
};