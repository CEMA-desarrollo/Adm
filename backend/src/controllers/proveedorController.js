const pool = require('../config/db');
const bitacoraService = require('../services/bitacoraService');

const getAllProveedores = async (req, res) => {
  try {
    // Versión robusta: solo pide los datos de la tabla. El frontend enriquece.
    const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY nombre_completo ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener proveedores.' });
  }
};

const createProveedor = async (req, res) => {
  const { nombre_completo, especialidad_id, tipo_proveedor, activo } = req.body;
  const usuario_id = req.user.id;

  if (!nombre_completo || !tipo_proveedor) {
    return res.status(400).json({ message: 'El nombre completo y el tipo de proveedor son obligatorios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO proveedores (nombre_completo, especialidad_id, tipo_proveedor, activo) VALUES (?, ?, ?, ?)',
      [nombre_completo, especialidad_id || null, tipo_proveedor, activo]
    );
    const nuevoId = result.insertId;
    const [nuevoProveedor] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [nuevoId]);
    await bitacoraService.logAction(usuario_id, 'CREACIÓN', 'proveedores', nuevoId, { nuevo_valor: nuevoProveedor[0] });
    res.status(201).json(nuevoProveedor[0]);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, especialidad_id, tipo_proveedor, activo } = req.body;
  const usuario_id = req.user.id;

  try {
    const [valorAnterior] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    if (valorAnterior.length === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }

    await pool.query(
      'UPDATE proveedores SET nombre_completo = ?, especialidad_id = ?, tipo_proveedor = ?, activo = ? WHERE id = ?',
      [nombre_completo, especialidad_id || null, tipo_proveedor, activo, id]
    );

    const [nuevoValor] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    await bitacoraService.logAction(usuario_id, 'ACTUALIZACIÓN', 'proveedores', id, { valor_anterior: valorAnterior[0], nuevo_valor: nuevoValor[0] });
    res.json(nuevoValor[0]);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteProveedor = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;
  try {
    await pool.query('UPDATE proveedores SET activo = 0 WHERE id = ?', [id]);
    await bitacoraService.logAction(usuario_id, 'DESACTIVACIÓN', 'proveedores', id, { registro_id: id });
    res.status(200).json({ message: 'Proveedor desactivado correctamente.' });
  } catch (error) {
    console.error('Error al desactivar proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deletePermanent = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;
    try {
        const [valorAnterior] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
        if (valorAnterior.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado.' });
        }
        await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
        await bitacoraService.logAction(usuario_id, 'ELIMINACIÓN PERMANENTE', 'proveedores', id, { valor_eliminado: valorAnterior[0] });
        res.status(200).json({ message: 'Proveedor eliminado permanentemente.' });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'No se puede eliminar el proveedor porque está asignado a tratamientos.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const getServicesByProveedor = async (req, res) => {
    const { proveedorId } = req.params;
    try {
        const [servicios] = await pool.query('SELECT * FROM proveedor_servicios WHERE proveedor_id = ?', [proveedorId]);
        res.json(servicios);
    } catch (error) {
        console.error(`Error al obtener servicios para el proveedor ${proveedorId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const updateProveedorServices = async (req, res) => {
    const { proveedorId } = req.params;
    const { servicios } = req.body; // Array de IDs de servicios
    const usuario_id = req.user.id;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [serviciosAnteriores] = await connection.query('SELECT servicio_id FROM proveedor_servicios WHERE proveedor_id = ?', [proveedorId]);
        await connection.query('DELETE FROM proveedor_servicios WHERE proveedor_id = ?', [proveedorId]);

        if (servicios && servicios.length > 0) {
            const values = servicios.map(servicioId => [proveedorId, servicioId]);
            await connection.query('INSERT INTO proveedor_servicios (proveedor_id, servicio_id) VALUES ?', [values]);
        }
        
        await connection.commit();
        await bitacoraService.logAction(usuario_id, 'ASIGNACIÓN_SERVICIOS', 'proveedores', proveedorId, { 
            servicios_anteriores: serviciosAnteriores.map(s => s.servicio_id), 
            servicios_nuevos: servicios 
        });
        res.status(200).json({ message: 'Servicios del proveedor actualizados correctamente.' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar servicios del proveedor:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        connection.release();
    }
};

module.exports = {
  getAllProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  deletePermanent,
  getServicesByProveedor,
  updateProveedorServices,
};
