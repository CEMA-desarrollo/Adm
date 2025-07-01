const Proveedor = require('../models/proveedorModel');
const ProveedorServicio = require('../models/proveedorServicioModel');
const Bitacora = require('../models/bitacoraModel');

const getAllProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    res.json(proveedor);
  } catch (error) {
    console.error(`Error al obtener proveedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createProveedor = async (req, res) => {
  try {
    const { nombre_completo, tipo_proveedor, especialidad_id } = req.body || {};
    if (!nombre_completo || !tipo_proveedor) {
      return res.status(400).json({ message: 'Los campos nombre_completo y tipo_proveedor son obligatorios.' });
    }
    const nuevoProveedor = await Proveedor.create({ nombre_completo, tipo_proveedor, especialidad_id });

    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'CREACIÓN',
      tabla_afectada: 'proveedores',
      registro_id_afectado: nuevoProveedor.id,
      detalles: { nuevo_valor: nuevoProveedor }
    });

    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body || {};

    const proveedorActual = await Proveedor.findById(id);
    if (!proveedorActual) {
      return res.status(404).json({ message: 'Proveedor no encontrado para actualizar.' });
    }

    const datosParaActualizar = {
      nombre_completo: updateData.nombre_completo || proveedorActual.nombre_completo,
      tipo_proveedor: updateData.tipo_proveedor || proveedorActual.tipo_proveedor,
      especialidad_id: updateData.especialidad_id !== undefined ? updateData.especialidad_id : proveedorActual.especialidad_id,
      activo: updateData.activo !== undefined ? Boolean(updateData.activo) : Boolean(proveedorActual.activo)
    };

    const updated = await Proveedor.update(id, datosParaActualizar);
    if (!updated) {
      return res.status(404).json({ message: 'Proveedor no encontrado o sin cambios.' });
    }

    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'proveedores',
      registro_id_afectado: id,
      detalles: { valor_anterior: proveedorActual, nuevo_valor: updated }
    });

    res.json(updated);
  } catch (error) {
    console.error(`Error al actualizar proveedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoAnterior = await Proveedor.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Proveedor no encontrado para desactivar.' });
    }
    const affectedRows = await Proveedor.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    await Bitacora.create({
      usuario_id: req.session.user?.id || null,
      accion: 'ELIMINACIÓN LÓGICA',
      tabla_afectada: 'proveedores',
      registro_id_afectado: id,
      detalles: { valor_desactivado: estadoAnterior }
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error al desactivar proveedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteProveedorPermanently = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoAnterior = await Proveedor.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Proveedor no encontrado para eliminar.' });
    }
    if (estadoAnterior.activo) {
      return res.status(400).json({ message: 'No se puede eliminar permanentemente un proveedor que está activo. Desactívelo primero.' });
    }
    const deleted = await Proveedor.deletePermanent(id);
    if (deleted) {
      await Bitacora.create({
        usuario_id: req.session.user?.id || null,
        accion: 'ELIMINACIÓN PERMANENTE',
        tabla_afectada: 'proveedores',
        registro_id_afectado: id,
        detalles: { valor_eliminado: estadoAnterior }
      });
      res.json({ message: 'Proveedor eliminado permanentemente.' });
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
  } catch (error) {
    console.error(`Error en la eliminación permanente del proveedor :`, error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'No se puede eliminar el proveedor porque tiene tratamientos asociados.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al eliminar el proveedor.' });
  }
};

const getProveedorServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const servicios = await ProveedorServicio.findByProveedorId(id);
    res.json(servicios);
  } catch (error) {
    console.error(`Error al obtener servicios para el proveedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateProveedorServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicios } = req.body;
    if (!Array.isArray(servicios)) {
      return res.status(400).json({ message: 'Se esperaba un array de IDs de servicios.' });
    }
    await ProveedorServicio.updateProveedorServices(id, servicios);
    res.status(200).json({ message: 'Servicios del proveedor actualizados correctamente.' });
  } catch (error) {
    console.error(`Error al actualizar servicios del proveedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  getProveedorServicios,
  updateProveedorServicios,
  deleteProveedorPermanently
};
