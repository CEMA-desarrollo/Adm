 const Tratamiento = require('../models/tratamientoModel');
 const Servicio = require('../models/servicioModel'); // Necesitamos el modelo de Servicio
 const Bitacora = require('../models/bitacoraModel');
 const Paciente = require('../models/pacienteModel'); // Importar el modelo de Paciente
 const Pago = require('../models/pagoModel'); // Importar el modelo de Pago para pagos automáticos
 const Proveedor = require('../models/proveedorModel'); // Importar el modelo de Proveedor
 const financialService = require('../services/financialService'); // Importar el servicio financiero

 const getAllTratamientos = async (req, res) => {
   try {
     const tratamientos = await Tratamiento.findAll();
     res.json(tratamientos);
   } catch (error) {
     console.error('Error al obtener tratamientos:', error);
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const getTratamientoById = async (req, res) => {
   try {
     const { id } = req.params;
     const tratamiento = await Tratamiento.findById(id);
     if (!tratamiento) {
       return res.status(404).json({ message: 'Tratamiento no encontrado.' });
     }
     res.json(tratamiento);
   } catch (error) {
     console.error(`Error al obtener tratamiento ${req.params.id}:`, error);
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const createTratamiento = async (req, res) => {
   try {
     const { paciente_id, proveedor_id, servicio_id, costo_final_acordado_usd, justificacion_descuento, fecha_tratamiento, descripcion_adicional } = req.body || {};

     if (!paciente_id || !proveedor_id || !servicio_id || !fecha_tratamiento) {
       return res.status(400).json({ message: 'Los campos paciente_id, proveedor_id, servicio_id y fecha_tratamiento son obligatorios.' });
     }

     // 0. Verify that the IDs exist
     const pacienteExists = await Paciente.findById(paciente_id);
     const proveedorExists = await Proveedor.findById(proveedor_id);
     const servicio = await Servicio.findById(servicio_id); // Se obtiene el servicio una sola vez

     if (!pacienteExists || !proveedorExists || !servicio) {
       return res.status(404).json({ message: 'El paciente, proveedor o servicio especificado no existe.' });
     }

     // --- Lógica de Negocio Avanzada ---
     // 1. Verificar el estado de cuenta del paciente ANTES de crear el tratamiento
     let saldoPaciente = await financialService.getPatientBalance(paciente_id);
     console.log(`Saldo del paciente ${paciente_id} antes del tratamiento: ${saldoPaciente} USD`);

     // 1. Obtener el costo original del servicio (ya lo tenemos)
     const costo_original_usd = servicio.precio_sugerido_usd;

     // 2. Preparar los datos para insertar
     const nuevoTratamientoData = {
       paciente_id,
       proveedor_id,
       servicio_id,
       descripcion_adicional,
       costo_original_usd,
       costo_final_acordado_usd: costo_final_acordado_usd !== undefined ? costo_final_acordado_usd : costo_original_usd,
       justificacion_descuento,
       fecha_tratamiento,
       estado: 'Registrado' // Default status
     };

     let montoPendienteTratamiento = nuevoTratamientoData.costo_final_acordado_usd;
     let tratamientoFacturado = false;

     // Si el paciente tiene saldo a favor, aplicarlo al nuevo tratamiento
     if (saldoPaciente > 0) {
       const montoAplicado = Math.min(saldoPaciente, montoPendienteTratamiento);
       
       // Crear un registro de pago que refleje el uso del saldo a favor
       const pagoPorSaldoData = {
         paciente_id: paciente_id,
         // tratamiento_id se asignará después de crear el tratamiento
         usuario_id: req.session.user.id, // El usuario actual es quien "registra" este pago
         monto: montoAplicado,
         moneda_pago: 'USD', // Siempre en USD ya que es saldo a favor
         metodo_pago: 'Saldo a Favor', // Nuevo método de pago para identificar
         tasa_cambio_aplicada: null,
         referencia_pago: `Aplicación de saldo a favor por tratamiento`,
         fecha_pago: new Date() // Fecha actual
       };

       // Reducir el monto pendiente del tratamiento
       montoPendienteTratamiento -= montoAplicado;
       saldoPaciente -= montoAplicado; // Actualizar el saldo del paciente

       // Si el tratamiento se cubre completamente, marcarlo como facturado
       if (montoPendienteTratamiento <= 0) {
         tratamientoFacturado = true;
         // nuevoTratamientoData.facturado = true; // No 'facturado' column in DB
       }

       // Guardar el pago por saldo a favor. El tratamiento_id se actualizará después.
       // Almacenamos el pago para asociarlo al tratamiento recién creado.
       req.pagoPorSaldoPendiente = pagoPorSaldoData;
       console.log(`Aplicado ${montoAplicado} USD de saldo a favor. Monto pendiente: ${montoPendienteTratamiento} USD`);
     }

     // Si el tratamiento no fue completamente cubierto por saldo a favor,
     // el costo_final_acordado_usd ya refleja el monto total.
     // Si fue cubierto, ya se marcó como facturado.

     const tratamientoCreado = await Tratamiento.create(nuevoTratamientoData);

     // --- Registro en Bitácora ---
     await Bitacora.create({
       usuario_id: req.session.user.id,
       accion: 'CREACIÓN',
       tabla_afectada: 'tratamientos',
       registro_id_afectado: tratamientoCreado.id,
       detalles: { nuevo_valor: tratamientoCreado }
     });
     // --- Fin Registro en Bitácora ---
     
     // Si se generó un pago por saldo a favor, asociarlo al tratamiento recién creado
     if (req.pagoPorSaldoPendiente) {
       req.pagoPorSaldoPendiente.tratamiento_id = tratamientoCreado.id;
       const pagoPorSaldoCreado = await Pago.create(req.pagoPorSaldoPendiente);
       console.log('Pago por saldo a favor registrado:', pagoPorSaldoCreado);

       // Registrar también en la bitácora la creación de este pago automático
       await Bitacora.create({
         usuario_id: req.session.user.id,
         accion: 'CREACIÓN_AUTOMATICA',
         tabla_afectada: 'pagos',
         registro_id_afectado: pagoPorSaldoCreado.id,
         detalles: { tipo: 'saldo_a_favor_aplicado', tratamiento_id: tratamientoCreado.id, nuevo_valor: pagoPorSaldoCreado }
       });
     }

     res.status(201).json(tratamientoCreado);

   } catch (error) {
     console.error('Error al crear tratamiento:', error);
     // Error si un ID de paciente, proveedor o servicio no existe en la BD
     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({ message: 'El paciente, proveedor o servicio especificado no existe.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const updateTratamiento = async (req, res) => {
   try {
     const { id } = req.params;
     const requestBody = req.body || {};
 
     const tratamientoActual = await Tratamiento.findById(id);
     if (!tratamientoActual) {
       return res.status(404).json({ message: 'Tratamiento no encontrado para actualizar.' });
     }
 
     // Construir el objeto de datos para actualizar, usando valores existentes si no se proporcionan nuevos
     const datosParaActualizar = {
       paciente_id: requestBody.paciente_id || tratamientoActual.paciente_id,
       proveedor_id: requestBody.proveedor_id || tratamientoActual.proveedor_id,
       servicio_id: requestBody.servicio_id || tratamientoActual.servicio_id,
       descripcion_adicional: requestBody.descripcion_adicional !== undefined ? requestBody.descripcion_adicional : tratamientoActual.descripcion_adicional,
       costo_original_usd: tratamientoActual.costo_original_usd, // El costo original no debería cambiar a menos que cambie el servicio
       costo_final_acordado_usd: requestBody.costo_final_acordado_usd !== undefined ? requestBody.costo_final_acordado_usd : tratamientoActual.costo_final_acordado_usd,
       justificacion_descuento: requestBody.justificacion_descuento !== undefined ? requestBody.justificacion_descuento : tratamientoActual.justificacion_descuento,
       estado: requestBody.estado || tratamientoActual.estado,
       fecha_tratamiento: requestBody.fecha_tratamiento || tratamientoActual.fecha_tratamiento,
     };

     // Si el servicio_id está cambiando, recalcular el costo_original_usd
     if (requestBody.servicio_id && requestBody.servicio_id !== tratamientoActual.servicio_id) {
       const nuevoServicio = await Servicio.findById(requestBody.servicio_id);
       if (!nuevoServicio) {
         return res.status(404).json({ message: `El nuevo servicio con id ${requestBody.servicio_id} no fue encontrado.` });
       }
       datosParaActualizar.costo_original_usd = nuevoServicio.precio_sugerido_usd;
       // Si el costo final no se especifica al cambiar el servicio, podría recalcularse o requerirse.
       // Por ahora, si no se provee costo_final_acordado_usd, se mantiene el anterior, lo cual puede ser inconsistente.
       // Mejorar: Si servicio cambia y costo_final_acordado_usd no está en requestBody, quizás debería tomar el nuevo costo_original_usd.
       if (requestBody.costo_final_acordado_usd === undefined) {
            datosParaActualizar.costo_final_acordado_usd = nuevoServicio.precio_sugerido_usd;
       }
     }
 
     // Validar que los campos clave no queden vacíos si se intentan modificar a un valor "falsy" pero no null/undefined
     // Esta validación es más laxa que la de creación, permite actualizar solo algunos campos.
     console.log('[DEBUG] tratamientoActual:', JSON.stringify(tratamientoActual, null, 2));
     console.log('[DEBUG] requestBody:', JSON.stringify(requestBody, null, 2));
     console.log('[DEBUG] datosParaActualizar PRE-VALIDATION:', JSON.stringify(datosParaActualizar, null, 2));

     if (datosParaActualizar.paciente_id === null || datosParaActualizar.proveedor_id === null || datosParaActualizar.servicio_id === null || datosParaActualizar.fecha_tratamiento === null || datosParaActualizar.costo_final_acordado_usd === null || datosParaActualizar.estado === null) {
        console.error('[VALIDATION_ERROR] One of the key fields is null in datosParaActualizar:', JSON.stringify(datosParaActualizar, null, 2));
        return res.status(400).json({ message: 'Los campos paciente_id, proveedor_id, servicio_id, fecha_tratamiento, costo_final_acordado_usd y estado no pueden ser nulos.' });
     }


     const tratamientoActualizadoEnModelo = await Tratamiento.update(id, datosParaActualizar);
     if (!tratamientoActualizadoEnModelo) { // El modelo ahora devuelve el objeto o null
       return res.status(404).json({ message: 'Tratamiento no encontrado o error al actualizar.' });
     }
 
     // --- Registro en Bitácora ---
     await Bitacora.create({
       usuario_id: req.session.user.id,
       accion: 'ACTUALIZACIÓN',
       tabla_afectada: 'tratamientos',
       registro_id_afectado: id,
       detalles: { valor_anterior: tratamientoActual, nuevo_valor: tratamientoActualizadoEnModelo }
     });
     // --- Fin Registro en Bitácora ---
 
     res.json(tratamientoActualizadoEnModelo);
   } catch (error) {
     console.error(`Error al actualizar tratamiento ${req.params.id}:`, error);
     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({ message: 'El paciente, proveedor o servicio especificado no existe.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };
 
 const deleteTratamiento = async (req, res) => { // This function now "cancels" a treatment
   try {
     const { id } = req.params;
 
     const tratamientoActual = await Tratamiento.findById(id);
     if (!tratamientoActual) {
       return res.status(404).json({ message: 'Tratamiento no encontrado para cancelar.' });
     }

     // Check if already cancelled
     if (tratamientoActual.estado === 'Cancelado') {
        return res.status(400).json({ message: 'El tratamiento ya está cancelado.' });
     }
 
     // Prepare data for update - only changing estado and preserving all other fields
     const datosParaCancelar = { ...tratamientoActual }; // Clone existing data
     delete datosParaCancelar.id; // remove id as it's not part of SET in model's update
     delete datosParaCancelar.created_at;
     delete datosParaCancelar.updated_at;
     // Ensure all necessary fields for the model's update method are present
     // The model's update method takes a 'fieldsToUpdate' object.
     // We need to ensure all fields expected by 'fieldsToUpdate' in Tratamiento.update are here.

     const updatePayload = {
        paciente_id: tratamientoActual.paciente_id,
        proveedor_id: tratamientoActual.proveedor_id,
        servicio_id: tratamientoActual.servicio_id,
        descripcion_adicional: tratamientoActual.descripcion_adicional,
        costo_original_usd: tratamientoActual.costo_original_usd,
        costo_final_acordado_usd: tratamientoActual.costo_final_acordado_usd,
        justificacion_descuento: tratamientoActual.justificacion_descuento,
        fecha_tratamiento: tratamientoActual.fecha_tratamiento,
        estado: 'Cancelado', // Set the new state
     };

     const tratamientoCancelado = await Tratamiento.update(id, updatePayload );

     if (!tratamientoCancelado) {
       return res.status(500).json({ message: 'Error al intentar cancelar el tratamiento.' });
     }
 
     // --- Registro en Bitácora ---
     await Bitacora.create({
       usuario_id: req.session.user.id,
       accion: 'CANCELACIÓN', // Changed from ELIMINACIÓN
       tabla_afectada: 'tratamientos',
       registro_id_afectado: id,
       detalles: { valor_anterior: tratamientoActual, nuevo_valor: tratamientoCancelado }
     });
     // --- Fin Registro en Bitácora ---
 
     res.status(200).json(tratamientoCancelado); // Return the updated treatment
   } catch (error) {
     console.error(`Error al cancelar tratamiento ${req.params.id}:`, error);
     // ER_ROW_IS_REFERENCED_2 should not be an issue for a status update
     res.status(500).json({ message: 'Error interno del servidor al cancelar el tratamiento.' });
   }
 };

 module.exports = {
   getAllTratamientos,
   getTratamientoById,
   createTratamiento,
   updateTratamiento,
   deleteTratamiento
 };