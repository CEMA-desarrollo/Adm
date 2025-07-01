const TasaDeCambio = require('../models/tasaDeCambioModel');

const getAllTasas = async (req, res) => {
  try {
    const tasas = await TasaDeCambio.findAll();
    res.json(tasas);
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
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
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createTasa = async (req, res) => {
  try {
    const { fecha, tasa_ves_por_usd } = req.body || {};
    if (!fecha || tasa_ves_por_usd === undefined) {
      return res.status(400).json({ message: 'Los campos fecha y tasa_ves_por_usd son obligatorios.' });
    }
    const nuevaTasa = await TasaDeCambio.create({ fecha, tasa_ves_por_usd });
    res.status(201).json(nuevaTasa);
  } catch (error) {
    console.error('Error al crear tasa de cambio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una tasa registrada para esa fecha.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllTasas,
  getLatestTasa,
  createTasa
};