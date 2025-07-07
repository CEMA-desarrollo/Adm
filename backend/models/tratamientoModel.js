const pool = require('../config/db');

const Tratamiento = {
  async create(tratamientoData) {
    // Ensure 'estado' has a default value if not provided
    const estado = tratamientoData.estado || 'Registrado';

    const [result] = await pool.query(
      `INSERT INTO tratamientos (paciente_id, proveedor_id, servicio_id, descripcion_adicional, costo_original_usd, costo_final_acordado_usd, justificacion_descuento, estado, fecha_tratamiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tratamientoData.paciente_id,
        tratamientoData.proveedor_id,
        tratamientoData.servicio_id,
        tratamientoData.descripcion_adicional,
        tratamientoData.costo_original_usd,
        tratamientoData.costo_final_acordado_usd,
        tratamientoData.justificacion_descuento,
        estado, // Use the potentially defaulted estado
        tratamientoData.fecha_tratamiento,
      ]
    );
    const [nuevoTratamiento] = await pool.query('SELECT * FROM tratamientos WHERE id = ?', [result.insertId]);
    return nuevoTratamiento[0];
  },

  async update(id, tratamientoData) {
    // LA SOLUCIÓN CLAVE: Creamos un objeto limpio con solo los campos que existen en la tabla.
    const fieldsToUpdate = {
      paciente_id: tratamientoData.paciente_id,
      proveedor_id: tratamientoData.proveedor_id,
      servicio_id: tratamientoData.servicio_id,
      descripcion_adicional: tratamientoData.descripcion_adicional,
      costo_original_usd: tratamientoData.costo_original_usd,
      costo_final_acordado_usd: tratamientoData.costo_final_acordado_usd,
      justificacion_descuento: tratamientoData.justificacion_descuento,
      estado: tratamientoData.estado,
      fecha_tratamiento: tratamientoData.fecha_tratamiento,
    };

    await pool.query('UPDATE tratamientos SET ? WHERE id = ?', [fieldsToUpdate, id]);
    
    const [updatedTratamiento] = await pool.query('SELECT * FROM tratamientos WHERE id = ?', [id]);
    return updatedTratamiento[0];
  },

  async findAll(page = 1, limit = 20) { // Valores por defecto para page y limit
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    // Asegurarse de que limit y offset sean números enteros no negativos
    const safeLimit = Math.max(1, parseInt(limit, 10));
    const safeOffset = Math.max(0, parseInt(offset, 10));

    const [rows] = await pool.query(
      'SELECT * FROM tratamientos ORDER BY fecha_tratamiento DESC, created_at DESC LIMIT ? OFFSET ?',
      [safeLimit, safeOffset]
    );

    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM tratamientos');
    const totalTratamientos = totalResult[0].total;

    return {
      tratamientos: rows,
      total: totalTratamientos,
      page: parseInt(page, 10),
      limit: safeLimit,
      totalPages: Math.ceil(totalTratamientos / safeLimit)
    };
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tratamientos WHERE id = ?', [id]);
    return rows[0];
  },

  async findByPatientId(paciente_id) {
    const [rows] = await pool.query('SELECT * FROM tratamientos WHERE paciente_id = ? ORDER BY fecha_tratamiento DESC, created_at DESC', [paciente_id]);
    return rows;
  },

  // Hard delete removed as per requirement to only cancel treatments (update status)
  // async delete(id) {
  //   const [result] = await pool.query('DELETE FROM tratamientos WHERE id = ?', [id]);
  //   return result.affectedRows;
  // },

  // Puedes añadir más funciones como findById si las necesitas.
};

module.exports = Tratamiento;