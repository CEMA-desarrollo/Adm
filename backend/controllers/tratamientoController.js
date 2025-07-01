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
       fecha_tratamiento
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
         nuevoTratamientoData.facturado = true; // Actualizar el campo en los datos del tratamiento
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
     const updateData = req.body || {};
 
     const { paciente_id, proveedor_id, servicio_id, fecha_tratamiento, costo_final_acordado_usd } = updateData;
     if (!paciente_id || !proveedor_id || !servicio_id || !fecha_tratamiento || costo_final_acordado_usd === undefined) {
       return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar el tratamiento.' });
     }
 
     const estadoAnterior = await Tratamiento.findById(id);
     if (!estadoAnterior) {
       return res.status(404).json({ message: 'Tratamiento no encontrado para actualizar.' });
     }
 
     // Si el servicio cambia, actualizamos el costo original
     if (updateData.servicio_id && updateData.servicio_id !== estadoAnterior.servicio_id) {
         const servicio = await Servicio.findById(updateData.servicio_id);
         if (!servicio) {
             return res.status(404).json({ message: `Servicio con id ${updateData.servicio_id} no encontrado.` });
         }
         updateData.costo_original_usd = servicio.precio_sugerido_usd;
     } else {
       // Mantenemos el costo original si el servicio no cambia
       updateData.costo_original_usd = estadoAnterior.costo_original_usd;
     }
 
     const affectedRows = await Tratamiento.update(id, updateData);
     if (affectedRows === 0) {
       return res.status(404).json({ message: 'Tratamiento no encontrado.' });
     }
 
     // --- Registro en Bitácora ---
     await Bitacora.create({
       usuario_id: req.session.user.id,
       accion: 'ACTUALIZACIÓN',
       tabla_afectada: 'tratamientos',
       registro_id_afectado: id,
       detalles: { valor_anterior: estadoAnterior, nuevo_valor: updateData }
     });
     // --- Fin Registro en Bitácora ---
 
     res.json({ id: Number(id), ...updateData });
   } catch (error) {
     console.error(`Error al actualizar tratamiento ${req.params.id}:`, error);
     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({ message: 'El paciente, proveedor o servicio especificado no existe.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };
 
 const deleteTratamiento = async (req, res) => {
   try {
     const { id } = req.params;
 
     const estadoAnterior = await Tratamiento.findById(id);
     if (!estadoAnterior) {
       return res.status(404).json({ message: 'Tratamiento no encontrado para eliminar.' });
     }
 
     const affectedRows = await Tratamiento.delete(id);
     if (affectedRows === 0) {
       return res.status(404).json({ message: 'Tratamiento no encontrado.' });
     }
 
     // --- Registro en Bitácora ---
     await Bitacora.create({
       usuario_id: req.session.user.id,
       accion: 'ELIMINACIÓN',
       tabla_afectada: 'tratamientos',
       registro_id_afectado: id,
       detalles: { valor_eliminado: estadoAnterior }
     });
     // --- Fin Registro en Bitácora ---
 
     res.status(204).send();
   } catch (error) {
     console.error(`Error al eliminar tratamiento ${req.params.id}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
       return res.status(409).json({ message: 'No se puede eliminar el tratamiento porque tiene pagos asociados.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 module.exports = {
   getAllTratamientos,
   getTratamientoById,
   createTratamiento,
   updateTratamiento,
   deleteTratamiento
 };