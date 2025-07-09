import apiClient from './apiClient'; // Asegúrate que la ruta a tu cliente de axios es correcta

const cajaService = {
  /**
   * Obtiene el estado actual de la caja desde el backend.
   */
  getEstado() {
    return apiClient.get('/caja/estado');
  },

  /**
   * Envía una solicitud para abrir la caja con un monto inicial.
   */
  abrirCaja(montoApertura) {
    return apiClient.post('/caja/abrir', { monto_apertura_usd: montoApertura });
  },

  /**
   * Envía una solicitud para cerrar la caja.
   */
  cerrarCaja(datosCierre) {
    return apiClient.post('/caja/cerrar', datosCierre);
  }
};

export default cajaService;