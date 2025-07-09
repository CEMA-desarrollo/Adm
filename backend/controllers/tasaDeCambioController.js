const TasaDeCambio = require('../models/tasaDeCambioModel');

const getAllTasas = async (req, res) => {
  try {
    const tasas = await TasaDeCambio.findAll();
    res.json(tasas);
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener las tasas.' });
  }
};

const getLatestTasa = async (req, res) => {
  try {
    const tasa = await TasaDeCambio.findLatest();
    if (!tasa) {
      return res.status(404).json({ message: 'No hay tasas de cambio registradas.' });
    }
    res.json(tasa);
  } catch (error) {
    console.error('Error al obtener la última tasa de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener la última tasa.' });
  }
};

const createOrUpdateTasa = async (req, res) => {
  try {
    const { fecha, tasa_bs_por_usd } = req.body || {};

    if (!fecha || tasa_bs_por_usd === undefined) {
      return res.status(400).json({ message: 'Los campos fecha y tasa_bs_por_usd son obligatorios.' });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ message: 'El formato de la fecha debe ser YYYY-MM-DD.' });
    }

    const rate = parseFloat(tasa_bs_por_usd);
    if (isNaN(rate) || rate <= 0) {
      return res.status(400).json({ message: 'El campo tasa_bs_por_usd debe ser un número positivo.' });
    }

    const tasaGuardada = await TasaDeCambio.createOrUpdate({ fecha, tasa_bs_por_usd: rate });
    res.status(201).json(tasaGuardada);
  } catch (error) {
    console.error('Error al crear o actualizar tasa de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor al guardar la tasa.' });
  }
};

module.exports = {
  getAllTasas,
  getLatestTasa,
  createOrUpdateTasa
};