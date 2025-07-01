const bitacoraService = require('../services/bitacoraService');
const Tratamiento = require('../models/tratamientoModel'); // <-- Importamos el modelo

const getAllTratamientos = async (req, res) => {
  try {
    const rows = await Tratamiento.findAll(); // <-- Usamos el modelo
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createTratamiento = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const nuevoTratamiento = await Tratamiento.create(req.body);
    await bitacoraService.logAction(usuario_id, 'CREACIÓN', 'tratamientos', nuevoTratamiento.id, { nuevo_valor: nuevoTratamiento });
    res.status(201).json(nuevoTratamiento);
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateTratamiento = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;
  try {
    // El modelo se encargará de verificar si existe.
    // Primero, obtenemos el valor anterior para la bitácora.
    const valorAnterior = await Tratamiento.findById(id); // Asumiendo que findById existe
    if (!valorAnterior) return res.status(404).json({ message: 'Tratamiento no encontrado.' });
    
    // Llamamos al modelo para que haga la actualización de forma segura
    const updatedTratamiento = await Tratamiento.update(id, req.body);
    
    await bitacoraService.logAction(usuario_id, 'ACTUALIZACIÓN', 'tratamientos', id, { valor_anterior: valorAnterior, nuevo_valor: updatedTratamiento });
    res.json(updatedTratamiento);
  } catch (error) {
    console.error(`Error al actualizar tratamiento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllTratamientos,
  createTratamiento,
  updateTratamiento,
};
