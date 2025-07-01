const Tratamiento = require('../models/tratamientoModel');
const Pago = require('../models/pagoModel');
const TasaDeCambio = require('../models/tasaDeCambioModel');

const financialService = {
  /**
   * Calcula el saldo de un paciente.
   * Un saldo positivo significa crédito a favor del paciente.
   * Un saldo negativo significa deuda.
   * @param {number} pacienteId - El ID del paciente.
   * @returns {Promise<number>} - El saldo del paciente en USD.
   */
  async getPatientBalance(pacienteId) {
    // 1. Obtener todos los tratamientos del paciente para calcular el costo total (deuda)
    const tratamientos = await Tratamiento.findByPatientId(pacienteId);
    const totalDeudaUSD = tratamientos.reduce((sum, tratamiento) => {
      // Usamos costo_final_acordado_usd que es el valor real a pagar
      return sum + parseFloat(tratamiento.costo_final_acordado_usd);
    }, 0);

    // 2. Obtener todos los pagos del paciente para calcular el total pagado
    const pagos = await Pago.findByPatientId(pacienteId);
    let totalPagadoUSD = 0;

    for (const pago of pagos) {
      const monto = parseFloat(pago.monto);
      if (pago.moneda_pago === 'USD') {
        totalPagadoUSD += monto;
      } else if (pago.moneda_pago === 'VES') {
        // Si el pago fue en VES, necesitamos convertirlo a USD
        // Si el pago tiene una tasa guardada, la usamos.
        // Si no, buscamos la tasa del día del pago.
        let tasa = pago.tasa_cambio_aplicada;
        if (!tasa) {
          // Asumimos que la fecha del pago está en formato 'YYYY-MM-DD HH:MM:SS'
          const fechaPago = new Date(pago.fecha_pago).toISOString().split('T')[0];
          const tasaDelDia = await TasaDeCambio.findByDate(fechaPago);
          if (tasaDelDia) {
            tasa = tasaDelDia.tasa_ves_por_usd;
          } else {
            // ¿Qué hacer si no hay tasa para ese día?
            // Por ahora, asumimos que no se puede convertir y no se suma al total pagado.
            console.warn(`No se encontró tasa de cambio para la fecha ${fechaPago} del pago ID ${pago.id}. Este pago no se incluirá en el saldo.`);
            continue;
          }
        }
        totalPagadoUSD += monto / parseFloat(tasa);
      }
    }

    // 3. Calcular el saldo final
    const saldo = totalPagadoUSD - totalDeudaUSD;
    
    // Redondear a 2 decimales para evitar problemas con punto flotante
    return parseFloat(saldo.toFixed(2));
  }
};

module.exports = financialService;