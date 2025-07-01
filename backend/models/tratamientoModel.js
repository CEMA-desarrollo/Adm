const pool = require('../config/db');

const Tratamiento = {
  async create(tratamientoData) {
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
        tratamientoData.estado,
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

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tratamientos ORDER BY fecha_tratamiento DESC, created_at DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tratamientos WHERE id = ?', [id]);
    return rows[0];
  },

  // Puedes añadir más funciones como findById si las necesitas.
};

module.exports = Tratamiento;