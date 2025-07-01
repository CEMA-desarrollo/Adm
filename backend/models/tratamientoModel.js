const pool = require('../config/db');

const Tratamiento = {
  async create(tratamientoData) {
    // Ahora incluimos el estado, que viene del frontend o usa un default.
    const [result] = await pool.query(
      `INSERT INTO tratamientos (paciente_id, proveedor_id, servicio_id, descripcion_adicional, costo_original_usd, costo_final_acordado_usd, justificacion_descuento, fecha_tratamiento, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tratamientoData.paciente_id,
        tratamientoData.proveedor_id,
        tratamientoData.servicio_id,
        tratamientoData.descripcion_adicional,
        tratamientoData.costo_original_usd,
        tratamientoData.costo_final_acordado_usd,
        tratamientoData.justificacion_descuento,
        tratamientoData.fecha_tratamiento,
        tratamientoData.estado || 'Programado', // Aseguramos que siempre haya un estado.
      ]
    );
    // Devolvemos el tratamiento completo con los nombres de las entidades relacionadas.
    return this.findById(result.insertId);
  },

  async update(id, tratamientoData) {
    // Esta es la corrección clave.
    // El método ahora es flexible y puede manejar actualizaciones completas o parciales.
    
    // Lista de campos permitidos para la actualización para mayor seguridad.
    const allowedFields = [
      'paciente_id', 'proveedor_id', 'servicio_id', 'descripcion_adicional', 
      'costo_original_usd', 'costo_final_acordado_usd', 'justificacion_descuento', 
      'fecha_tratamiento', 'estado'
    ];

    const fieldsToUpdate = {};
    // Construimos un objeto solo con los campos permitidos que vienen en la petición.
    for (const field of allowedFields) {
        if (tratamientoData[field] !== undefined) {
            fieldsToUpdate[field] = tratamientoData[field];
        }
    }

    // Si no hay campos válidos para actualizar, no hacemos nada en la BD.
    if (Object.keys(fieldsToUpdate).length === 0) {
      console.warn(`Update attempt on tratamiento ${id} with no valid fields.`);
      return this.findById(id); // Devolvemos el objeto sin cambios.
    }

    const [result] = await pool.query('UPDATE tratamientos SET ? WHERE id = ?', [fieldsToUpdate, id]);
    if (result.affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  },

  async findAll() {
    // Se enriquecen los datos con los nombres de las entidades relacionadas. La columna 'estado' se incluye con t.*
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        CONCAT(p.nombre, ' ', p.apellido) as paciente_nombre,
        prov.nombre_completo as proveedor_nombre,
        s.nombre_servicio as servicio_nombre
      FROM tratamientos t
      LEFT JOIN pacientes p ON t.paciente_id = p.id
      LEFT JOIN proveedores prov ON t.proveedor_id = prov.id
      LEFT JOIN servicios s ON t.servicio_id = s.id
      ORDER BY t.fecha_tratamiento DESC, t.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        CONCAT(p.nombre, ' ', p.apellido) as paciente_nombre,
        prov.nombre_completo as proveedor_nombre,
        s.nombre_servicio as servicio_nombre
      FROM tratamientos t
      LEFT JOIN pacientes p ON t.paciente_id = p.id
      LEFT JOIN proveedores prov ON t.proveedor_id = prov.id
      LEFT JOIN servicios s ON t.servicio_id = s.id
      WHERE t.id = ?
    `, [id]);
    return rows[0];
  },

  async findByPatientId(paciente_id) {
    // Esta consulta también se podría enriquecer, pero la mantengo simple por si se usa en un contexto que no necesita los JOINs.
    const [rows] = await pool.query('SELECT * FROM tratamientos WHERE paciente_id = ? ORDER BY fecha_tratamiento DESC, created_at DESC', [paciente_id]);
    return rows;
  },
};

module.exports = Tratamiento;