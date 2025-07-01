const Especialidad = require('../models/especialidadModel');
const Bitacora = require('../models/bitacoraModel');

const getAllEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findById(id);
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada.' });
    }
    res.json(especialidad);
  } catch (error) {
    console.error(`Error al obtener especialidad ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createEspecialidad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body || {};
    if (!nombre) {
      return res.status(400).json({ message: 'El campo nombre es obligatorio.' });
    }

    const especialidadExistente = await Especialidad.findByName(nombre);
    if (especialidadExistente) {
      return res.status(409).json({ message: 'Ya existe una especialidad con este nombre.' });
    }

    const nuevaEspecialidad = await Especialidad.create({ nombre, descripcion });

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'CREACIÓN',
      tabla_afectada: 'especialidades',
      registro_id_afectado: nuevaEspecialidad.id,
      detalles: { nuevo_valor: nuevaEspecialidad }
    });
    // --- Fin Registro en Bitácora ---

    res.status(201).json(nuevaEspecialidad);
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body || {};

    if (!nombre || typeof activo !== 'boolean') {
      return res.status(400).json({ message: 'Los campos nombre y activo son obligatorios.' });
    }

    const estadoAnterior = await Especialidad.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Especialidad no encontrada para actualizar.' });
    }

    // Verificar si el nuevo nombre ya existe para otra especialidad
    const especialidadExistente = await Especialidad.findByName(nombre);
    if (especialidadExistente && especialidadExistente.id !== Number(id)) {
      return res.status(409).json({ message: 'Ya existe otra especialidad con este nombre.' });
    }

    const affectedRows = await Especialidad.update(id, { nombre, descripcion, activo });
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada o no se realizaron cambios.' });
    }

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'especialidades',
      registro_id_afectado: id,
      detalles: { valor_anterior: estadoAnterior, nuevo_valor: req.body }
    });
    // --- Fin Registro en Bitácora ---

    res.json({ id: Number(id), ...req.body });
  } catch (error) {
    console.error(`Error al actualizar especialidad ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const estadoAnterior = await Especialidad.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Especialidad no encontrada para eliminar.' });
    }

    // Borrado lógico, consistente con otros controladores
    const affectedRows = await Especialidad.update(id, { activo: false });
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada.' });
    }

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'ELIMINACIÓN',
      tabla_afectada: 'especialidades',
      registro_id_afectado: id,
      detalles: { valor_eliminado: estadoAnterior }
    });
    // --- Fin Registro en Bitácora ---

    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar especialidad ${req.params.id}:`, error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'No se puede eliminar la especialidad porque está asociada a servicios existentes.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
};