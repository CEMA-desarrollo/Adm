const dbPool = require('../config/db');

const ProveedorServicio = {
  /**
   * Encuentra todos los servicios asociados a un proveedor.
   * @param {number} proveedorId - El ID del proveedor.
   */
  async findByProveedorId(proveedorId) {
    const query = `
      SELECT s.id as servicio_id, s.nombre_servicio 
      FROM proveedor_servicios ps
      JOIN servicios s ON ps.servicio_id = s.id
      WHERE ps.proveedor_id = ?
    `;
    const [rows] = await dbPool.query(query, [proveedorId]);
    return rows;
  },

  /**
   * Actualiza la lista de servicios para un proveedor.
   * Utiliza una transacción para garantizar la integridad de los datos.
   * @param {number} proveedorId - El ID del proveedor.
   * @param {number[]} serviceIds - Un array con los IDs de los nuevos servicios.
   */
  async updateProveedorServices(proveedorId, serviceIds) {
    const connection = await dbPool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Borra todas las asignaciones de servicios existentes para este proveedor.
      await connection.query('DELETE FROM proveedor_servicios WHERE proveedor_id = ?', [proveedorId]);

      // 2. Si la nueva lista de servicios no está vacía, inserta las nuevas asignaciones.
      if (serviceIds && serviceIds.length > 0) {
        const values = serviceIds.map(servicioId => [proveedorId, servicioId]);
        await connection.query('INSERT INTO proveedor_servicios (proveedor_id, servicio_id) VALUES ?', [values]);
      }

      // 3. Si todo fue bien, confirma la transacción.
      await connection.commit();
    } catch (error) {
      // 4. Si algo falló, revierte todos los cambios.
      await connection.rollback();
      console.error("Error en la transacción al actualizar servicios del proveedor:", error);
      throw error; // Lanza el error para que el controlador lo capture.
    } finally {
      // 5. Libera la conexión para que otros puedan usarla.
      connection.release();
    }
  }
};

module.exports = ProveedorServicio;
