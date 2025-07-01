const Pago = require('../models/pagoModel');
const Bitacora = require('../models/bitacoraModel');
const Paciente = require('../models/pacienteModel'); // Necesario para validar paciente_id
const Tratamiento = require('../models/tratamientoModel'); // Necesario para validar tratamiento_id

const getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findById(id);
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado.' });
    }
    res.json(pago);
  } catch (error) {
    console.error(`Error al obtener pago ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createPago = async (req, res) => {
  try {
    const { paciente_id, tratamiento_id, monto, moneda_pago, metodo_pago, tasa_cambio_aplicada, referencia_pago, fecha_pago } = req.body; // Asegura que usuario_id sea válido o null
    const usuario_id = req.session.user.id; // Obtener el ID del usuario de la sesión

    if (!paciente_id || !usuario_id || !monto || !moneda_pago || !metodo_pago || !fecha_pago) {
      return res.status(400).json({ message: 'Los campos paciente_id, usuario_id, monto, moneda_pago, metodo_pago y fecha_pago son obligatorios.' });
    }

    // --- Validación de método de pago por moneda ---
    const metodosValidosUSD = ['Efectivo', 'Zelle'];
    const metodosValidosVES = ['Efectivo', 'Transferencia', 'Punto de Venta'];

    if (moneda_pago === 'USD' && !metodosValidosUSD.includes(metodo_pago)) {
      return res.status(400).json({ message: `Para pagos en USD, el método de pago debe ser 'Efectivo' o 'Zelle'.` });
    }

    if (moneda_pago === 'VES' && !metodosValidosVES.includes(metodo_pago)) {
      return res.status(400).json({ message: `Para pagos en VES, el método de pago debe ser 'Efectivo', 'Transferencia' o 'Punto de Venta'.` });
    }
    // --- Fin de la validación ---

    // Validar claves foráneas
    const pacienteExists = await Paciente.findById(paciente_id);
    if (!pacienteExists) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }

    if (tratamiento_id) {
      const tratamientoExists = await Tratamiento.findById(tratamiento_id);
      if (!tratamientoExists) {
        return res.status(404).json({ message: 'Tratamiento no encontrado.' });
      }
    }

    const nuevoPagoData = {
      paciente_id,
      tratamiento_id: tratamiento_id || null, // Permitir nulo para pagos por adelantado
      usuario_id,
      monto,
      moneda_pago,
      metodo_pago,
      tasa_cambio_aplicada: tasa_cambio_aplicada !== undefined ? tasa_cambio_aplicada : null,
      referencia_pago: referencia_pago || null,
      fecha_pago
    };

    const pagoCreado = await Pago.create(nuevoPagoData);

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null, // Asegura que usuario_id sea válido o null
      accion: 'CREACIÓN',
      tabla_afectada: 'pagos',
      registro_id_afectado: pagoCreado.id,
      detalles: { nuevo_valor: pagoCreado }
    });
    // --- Fin Registro en Bitácora ---

    res.status(201).json(pagoCreado);

  } catch (error) {
    console.error('Error al crear pago:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ message: 'El paciente, tratamiento o usuario especificado no existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const usuario_id = req.session.user.id; // Obtener el ID del usuario de la sesión

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    const estadoAnterior = await Pago.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Pago no encontrado para actualizar.' });
    }

    // --- Validación de método de pago por moneda para actualización ---
    // No se debe permitir modificar los campos financieros de un pago generado por 'Saldo a Favor'
    if (estadoAnterior.metodo_pago === 'Saldo a Favor') {
      if (updateData.metodo_pago || updateData.monto || updateData.moneda_pago) {
        return res.status(403).json({ message: 'No se pueden modificar los campos financieros de un pago generado por saldo a favor.' });
      }
    } else {
      // Para pagos manuales, validar la combinación final
      const monedaFinal = updateData.moneda_pago || estadoAnterior.moneda_pago;
      const metodoFinal = updateData.metodo_pago || estadoAnterior.metodo_pago;

      const metodosValidosUSD = ['Efectivo', 'Zelle'];
      const metodosValidosVES = ['Efectivo', 'Transferencia', 'Punto de Venta'];

      if (monedaFinal === 'USD' && !metodosValidosUSD.includes(metodoFinal)) {
          return res.status(400).json({ message: `Para pagos en USD, el método de pago debe ser 'Efectivo' o 'Zelle'.` });
      }
      if (monedaFinal === 'VES' && !metodosValidosVES.includes(metodoFinal)) {
          return res.status(400).json({ message: `Para pagos en VES, el método de pago debe ser 'Efectivo', 'Transferencia' o 'Punto de Venta'.` });
      }
    }
    // --- Fin de la validación ---

    // Validar claves foráneas si se están actualizando
    if (updateData.paciente_id) {
      const pacienteExists = await Paciente.findById(updateData.paciente_id);
      if (!pacienteExists) {
        return res.status(404).json({ message: 'Paciente no encontrado.' });
      }
    }
    if (updateData.tratamiento_id) {
      const tratamientoExists = await Tratamiento.findById(updateData.tratamiento_id);
      if (!tratamientoExists) {
        return res.status(404).json({ message: 'Tratamiento no encontrado.' });
      }
    }

    // Asegurarse de que el usuario que realiza la actualización quede registrado
    updateData.usuario_id = usuario_id;

    const affectedRows = await Pago.update(id, updateData);
    if (affectedRows === 0) { // Asegura que usuario_id sea válido o null
      return res.status(404).json({ message: 'Pago no encontrado.' });
    }

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user.id,
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'pagos',
      registro_id_afectado: id,
      detalles: { valor_anterior: estadoAnterior, nuevo_valor: updateData }
    });
    // --- Fin Registro en Bitácora ---

    res.json({ id: Number(id), ...updateData });
  } catch (error) {
    console.error(`Error al actualizar pago ${req.params.id}:`, error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ message: 'El paciente, tratamiento o usuario especificado no existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deletePago = async (req, res) => {
  try {
    const { id } = req.params;

    const estadoAnterior = await Pago.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Pago no encontrado para eliminar.' });
    }

    const affectedRows = await Pago.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado.' });
    }

    // --- Registro en Bitácora ---
    await Bitacora.create({ // Asegura que usuario_id sea válido o null
      usuario_id: req.session.user?.id || null,
      accion: 'ELIMINACIÓN',
      tabla_afectada: 'pagos',
      registro_id_afectado: id,
      detalles: { valor_eliminado: estadoAnterior }
    });
    // --- Fin Registro en Bitácora ---

    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar pago ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
};