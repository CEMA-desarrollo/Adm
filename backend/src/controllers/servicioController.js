const pool = require('../config/db'); // Asumo que tienes un archivo de conexión a la DB
const bitacoraService = require('../services/bitacoraService'); // Asumo que tienes un servicio para la bitácora

/**
 * Obtiene todos los servicios, uniendo la información de la especialidad.
 * El frontend mostrará el estado 'activo' o 'inactivo'.
 */
const getAllServicios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.*, 
        e.nombre as especialidad_nombre 
      FROM servicios s
      LEFT JOIN especialidades e ON s.especialidad_id = e.id
      ORDER BY s.nombre_servicio ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Crea un nuevo servicio.
 */
const createServicio = async (req, res) => {
  const { nombre_servicio, descripcion, especialidad_id, precio_sugerido_usd, activo } = req.body;
  const usuario_id = req.user.id; // Obtenido del token JWT a través del middleware

  if (!nombre_servicio || precio_sugerido_usd === undefined) {
    return res.status(400).json({ message: 'El nombre y el precio del servicio son obligatorios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO servicios (nombre_servicio, descripcion, especialidad_id, precio_sugerido_usd, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre_servicio, descripcion || null, especialidad_id || null, precio_sugerido_usd, activo]
    );
    const nuevoServicioId = result.insertId;
    
    const [nuevoServicio] = await pool.query(`
        SELECT s.*, e.nombre as especialidad_nombre 
        FROM servicios s 
        LEFT JOIN especialidades e ON s.especialidad_id = e.id 
        WHERE s.id = ?`, 
        [nuevoServicioId]
    );

    await bitacoraService.logAction(usuario_id, 'CREACIÓN', 'servicios', nuevoServicioId, { nuevo_valor: nuevoServicio[0] });

    res.status(201).json(nuevoServicio[0]);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un servicio con ese nombre.' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Actualiza un servicio existente.
 */
const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre_servicio, descripcion, especialidad_id, precio_sugerido_usd, activo } = req.body;
  const usuario_id = req.user.id;

  try {
    const [valorAnterior] = await pool.query('SELECT * FROM servicios WHERE id = ?', [id]);
    if (valorAnterior.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    await pool.query(
      'UPDATE servicios SET nombre_servicio = ?, descripcion = ?, especialidad_id = ?, precio_sugerido_usd = ?, activo = ? WHERE id = ?',
      [nombre_servicio, descripcion || null, especialidad_id || null, precio_sugerido_usd, activo, id]
    );

    const [nuevoValor] = await pool.query('SELECT s.*, e.nombre as especialidad_nombre FROM servicios s LEFT JOIN especialidades e ON s.especialidad_id = e.id WHERE s.id = ?', [id]);
    await bitacoraService.logAction(usuario_id, 'ACTUALIZACIÓN', 'servicios', id, { valor_anterior: valorAnterior[0], nuevo_valor: nuevoValor[0] });

    res.json(nuevoValor[0]);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un servicio con ese nombre.' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Desactiva un servicio (Soft Delete).
 */
const deleteServicio = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  try {
    const [valorAnterior] = await pool.query('SELECT * FROM servicios WHERE id = ?', [id]);
    if (valorAnterior.length === 0) return res.status(404).json({ message: 'Servicio no encontrado.' });

    await pool.query('UPDATE servicios SET activo = 0 WHERE id = ?', [id]);
    await bitacoraService.logAction(usuario_id, 'DESACTIVACIÓN', 'servicios', id, { valor_desactivado: valorAnterior[0] });

    res.status(200).json({ message: 'Servicio desactivado correctamente.' });
  } catch (error) {
    console.error('Error al desactivar el servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Elimina un servicio permanentemente de la base de datos.
 */
const deleteServicioPermanently = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  try {
    const [valorAnterior] = await pool.query('SELECT * FROM servicios WHERE id = ?', [id]);
    if (valorAnterior.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado para eliminar permanentemente.' });
    }

    await pool.query('DELETE FROM servicios WHERE id = ?', [id]);
    await bitacoraService.logAction(usuario_id, 'ELIMINACIÓN PERMANENTE', 'servicios', id, { valor_eliminado: valorAnterior[0] });

    res.status(200).json({ message: 'Servicio eliminado permanentemente.' });
  } catch (error) {
    console.error('Error al eliminar permanentemente el servicio:', error);
    // Manejar errores de clave foránea si el servicio está en uso
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'No se puede eliminar el servicio porque está siendo utilizado en tratamientos.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  deleteServicioPermanently,
};