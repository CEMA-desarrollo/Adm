const db = require('../config/db.js'); // Asegúrate que la ruta a tu configuración de DB sea correcta

const SesionCaja = {
  /**
   * Busca una sesión de caja que esté actualmente abierta.
   * @returns {Promise<object|undefined>} La sesión abierta o undefined si no hay ninguna.
   */
  findOpenSession: async () => {
     const [rows] = await db.query(
       `SELECT sc.*, u.nombre_usuario 
        FROM sesiones_caja sc
        JOIN usuarios u ON sc.usuario_id = u.id
        WHERE sc.estado = 'ABIERTA' 
        LIMIT 1`
     );
     return rows[0];
   },
 
   /**
    * Crea una nueva sesión de caja (Apertura de caja).
    * @param {number} usuarioId - ID del usuario que abre la caja.
    * @param {number} montoApertura - Monto inicial en USD.
    * @returns {Promise<number>} El ID de la nueva sesión creada.
    */
   create: async (usuarioId, montoApertura) => {
     const [result] = await db.query( // Ahora insertamos un objeto JSON
       'INSERT INTO sesiones_caja (usuario_id, fecha_apertura, montos_apertura, estado) VALUES (?, NOW(), ?, "ABIERTA")',
       [usuarioId, JSON.stringify(montoApertura), 'ABIERTA']
     );
     return result.insertId;
   },
 
   /**
    * Cierra una sesión de caja existente.
    * @param {number} id - ID de la sesión a cerrar.
    * @param {object} datosCierre - Objeto con los datos del cierre.
    * @param {object} datosCierre.montos_cierre_calculado
    * @param {object} datosCierre.montos_cierre_real
    * @param {object} datosCierre.diferencias
    * @param {string} datosCierre.notas
    * @returns {Promise<boolean>} True si la actualización fue exitosa.
    */
   close: async (id, datosCierre) => {
     const { montos_cierre_calculado, montos_cierre_real, diferencias, notas } = datosCierre;
     const [result] = await db.query(
       `UPDATE sesiones_caja SET 
         fecha_cierre = NOW(),
         montos_cierre_calculado = ?,
         montos_cierre_real = ?,
         diferencias = ?,
         estado = 'CERRADA',
         notas = ?
        WHERE id = ?`,
       [JSON.stringify(montos_cierre_calculado), JSON.stringify(montos_cierre_real), JSON.stringify(diferencias), notas, id]
     );
     return result.affectedRows > 0;
   },
 
   /**
    * Busca una sesión por su ID.
    * @param {number} id - El ID de la sesión de caja.
    * @returns {Promise<object|undefined>} La sesión o undefined si no se encuentra.
    */
   findById: async (id) => {
     const [rows] = await db.query(`
        SELECT sc.*, u.nombre_usuario 
        FROM sesiones_caja sc
        JOIN usuarios u ON sc.usuario_id = u.id
        WHERE sc.id = ?`, [id]);
     // El driver de MySQL/MariaDB parsea automáticamente las columnas JSON a objetos
     return rows[0];
   },

  /**
   * Calcula la suma de pagos durante la sesión, agrupados por método de pago.
   * @param {string} fechaApertura - La fecha y hora en que se abrió la sesión.
   * @returns {Promise<object>} Un objeto con los totales por método. Ej: { zelle: 150, pago_movil: 2000 }
   */
   calculateTotalPaymentsForSession: async (fechaApertura) => {
    // Asume que la tabla 'pagos' tiene 'monto' y 'metodo_pago'
    const [rows] = await db.query( // La consulta ahora agrupa por método de pago
      `SELECT metodo_pago, SUM(monto) AS total 
       FROM pagos 
       WHERE fecha_pago >= ? AND fecha_pago <= NOW()
       GROUP BY metodo_pago`,
      [fechaApertura]
    );
    // Transforma el array de resultados en un solo objeto
    const totales = rows.reduce((acc, row) => {
      acc[row.metodo_pago] = parseFloat(row.total);
      return acc;
    }, {});
    return totales;
   }
 };

 module.exports = SesionCaja;