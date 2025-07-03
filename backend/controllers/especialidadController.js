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

    const especialidadActual = await Especialidad.findById(id); // Renombrado para claridad
    if (!especialidadActual) {
      return res.status(404).json({ message: 'Especialidad no encontrada.' });
    }

    // Si la especialidad ya está inactiva, no hay nada que hacer.
    // Se considera la operación exitosa ya que el estado deseado (inactivo) se cumple.
    if (especialidadActual.activo === false) {
      console.log(`[INFO] Intento de eliminar especialidad ID ${id} que ya estaba inactiva.`);
      return res.status(204).send();
    }

    // Intentar la desactivación usando el método correcto del modelo
    const affectedRows = await Especialidad.delete(id);

    // Si affectedRows es 0 aquí, a pesar de que la encontramos activa, es un error inesperado.
    // (Ej: modificación concurrente, o un problema en la BD que no lanzó excepción)
    if (affectedRows === 0) {
      console.warn(`[WARN] Especialidad ID ${id} se encontró activa pero no se pudo desactivar (affectedRows = 0).`);
      // Devolver un error genérico porque es una situación anómala.
      return res.status(500).json({ message: 'La especialidad fue encontrada pero no pudo ser desactivada. Intente nuevamente.' });
    }

    // Si llegamos aquí, la especialidad fue encontrada activa y desactivada con éxito (affectedRows > 0)
    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null, // Asumiendo que req.session.user puede no existir si se relaja la autenticación
      accion: 'DESACTIVACIÓN', // Más preciso que 'ELIMINACIÓN' para un borrado lógico
      tabla_afectada: 'especialidades',
      registro_id_afectado: id,
      // Guardamos el estado ANTES de la desactivación como 'valor_eliminado' o 'valor_anterior'
      detalles: { valor_anterior: especialidadActual }
    });
    // --- Fin Registro en Bitácora ---

    res.status(204).send(); // Éxito, sin contenido

  } catch (error) {
    console.error(`Error al desactivar especialidad ${req.params.id}:`, error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'No se puede desactivar la especialidad porque está asociada a otros registros activos (ej. servicios). Primero debe desasociarla.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al intentar desactivar la especialidad.' });
  }
};

module.exports = {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
};