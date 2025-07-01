const Servicio = require('../models/servicioModel');
const Bitacora = require('../models/bitacoraModel');

/**
 * Obtiene todos los servicios ACTIVOS.
 * Soluciona el problema del borrado lógico.
 */
async function getAllServicios(req, res) {
  try {
    // Eliminamos el filtro { where: { activo: 1 } } para obtener TODOS los servicios.
    // El frontend se encargará de separar los activos de los inactivos.
    // Esto permite que la vista muestre ambas listas y permita reactivar servicios.
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener servicios.' });
  }
}

/**
 * Crea un nuevo servicio, alineado con la BD.
 */
async function createServicio(req, res) {
  const { nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion } = req.body;

  if (!nombre_servicio || precio_sugerido_usd === undefined) {
    return res.status(400).json({ message: 'El nombre y el precio del servicio son requeridos.' });
  }

  try {
    const nuevoServicioData = {
      nombre_servicio,
      precio_sugerido_usd,
      especialidad_id: especialidad_id || null,
      descripcion: descripcion || null,
    };

    const nuevoServicio = await Servicio.create(nuevoServicioData);

    await Bitacora.create({
      usuario_id: req.session.user.id,
      accion: 'CREACIÓN',
      tabla_afectada: 'servicios',
      registro_id_afectado: nuevoServicio.id,
      detalles: { nuevo_valor: nuevoServicio }
    });

    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: `El servicio '${nombre_servicio}' ya existe.` });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear el servicio.' });
  }
}

/**
 * Actualiza un servicio existente.
 */
async function updateServicio(req, res) {
  const { id } = req.params;
  const { nombre_servicio, precio_sugerido_usd, especialidad_id, descripcion, activo } = req.body;

  if (!nombre_servicio || precio_sugerido_usd === undefined || activo === undefined) {
    return res.status(400).json({ message: 'Nombre, precio y estado de activación son requeridos.' });
  }

  try {
    const valor_anterior = await Servicio.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    const datosActualizados = {
      nombre_servicio,
      precio_sugerido_usd,
      especialidad_id: especialidad_id || null,
      descripcion: descripcion || null,
      activo: Boolean(activo),
    };

    const updated = await Servicio.update(id, datosActualizados);

    if (updated) {
      await Bitacora.create({
        usuario_id: req.session.user.id,
        accion: 'ACTUALIZACIÓN',
        tabla_afectada: 'servicios',
        registro_id_afectado: id,
        detalles: {
          valor_anterior,
          nuevo_valor: { id: parseInt(id), ...datosActualizados }
        }
      });
      res.json({ message: 'Servicio actualizado con éxito.' });
    } else {
      res.status(404).json({ message: 'Servicio no encontrado o sin cambios.' });
    }
  } catch (error) {
    console.error(`Error al actualizar servicio ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el servicio.' });
  }
}

/**
 * "Elimina" un servicio (borrado lógico).
 */
async function deleteServicio(req, res) {
  const { id } = req.params;
  try {
    const valor_anterior = await Servicio.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }
    
    const deleted = await Servicio.remove(id);

    if (deleted) {
      await Bitacora.create({
        usuario_id: req.session.user.id,
        accion: 'ELIMINACIÓN LÓGICA',
        tabla_afectada: 'servicios',
        registro_id_afectado: id,
        detalles: { valor_desactivado: valor_anterior }
      });
      res.json({ message: 'Servicio desactivado con éxito.' });
    } else {
      res.status(404).json({ message: 'Servicio no encontrado.' });
    }
  } catch (error) {
    console.error(`Error al eliminar servicio ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el servicio.' });
  }
}

/**
 * Elimina un servicio permanentemente de la base de datos.
 */
async function deleteServicioPermanently(req, res) {
  const { id } = req.params;
  try {
    const valor_anterior = await Servicio.findById(id);
    if (!valor_anterior) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    const deleted = await Servicio.deletePermanent(id);

    if (deleted) {
      await Bitacora.create({
        usuario_id: req.session.user.id,
        accion: 'ELIMINACIÓN PERMANENTE',
        tabla_afectada: 'servicios',
        registro_id_afectado: id,
        detalles: { valor_eliminado: valor_anterior }
      });
      res.json({ message: 'Servicio eliminado permanentemente.' });
    } else {
      res.status(404).json({ message: 'Servicio no encontrado.' });
    }
  } catch (error) {
    console.error(`Error en la eliminación permanente del servicio ${id}:`, error);
    // Maneja el error si el servicio está siendo usado en otra tabla (ej. tratamientos)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ message: 'No se puede eliminar el servicio porque está siendo utilizado en uno o más tratamientos.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al eliminar el servicio.' });
  }
}

module.exports = {
  getAllServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  deleteServicioPermanently,
};
