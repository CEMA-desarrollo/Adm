 const Paciente = require('../models/pacienteModel');
const Bitacora = require('../models/bitacoraModel');

// Regex para validación de formato (ejemplos)
const documentoIdentidadRegex = /^(V-|E-|J-|G-)?\d{7,9}$/i; // Acepta prefijos V-, E-, J-, G- y 7-9 dígitos
const numeroHistoriaRegex = /^(H-)?\d+$/i; // Acepta prefijo H- y solo dígitos

// Helper function to ensure H- prefix for numero_historia
function formatNumeroHistoria(numHistoria) {
  if (!numHistoria) return numHistoria; // Return null/undefined if empty
  // Check if it doesn't start with H- (case-insensitive)
  if (!/^(H-)/i.test(numHistoria)) {
    return 'H-' + numHistoria;
  }
  return numHistoria;
}

// Helper function to ensure V- prefix for documento_identidad if no other prefix is present
function formatDocumentoIdentidad(docIdentidad) {
  if (!docIdentidad) return docIdentidad; // Return null/undefined if empty
  // Check if it already starts with any of the allowed prefixes (V-, E-, J-, G-)
  if (!/^(V-|E-|J-|G-)/i.test(docIdentidad)) {
    return 'V-' + docIdentidad;
  }
  return docIdentidad;
}

 const getAllPacientes = async (req, res) => {
   try {
     // Modificado para obtener solo pacientes activos
     const pacientes = await Paciente.findAll({ where: { activo: true } });
     res.json(pacientes);
   } catch (error) {
     console.error('Error al obtener pacientes:', error);
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const getPacienteById = async (req, res) => {
   try {
     const { id } = req.params;
     const paciente = await Paciente.findById(id);
     if (!paciente) {
       return res.status(404).json({ message: 'Paciente no encontrado.' });
     }
     res.json(paciente);
   } catch (error) {
     console.error(`Error al obtener paciente ${req.params.id}:`, error);
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const createPaciente = async (req, res) => {
   try {
     const { nombre, apellido, documento_identidad, numero_historia } = req.body || {};
     if (!nombre || !apellido || !documento_identidad) {
       return res.status(400).json({ message: 'Los campos nombre, apellido y documento_identidad son obligatorios.' });
     }

    if (!documentoIdentidadRegex.test(documento_identidad)) {
      return res.status(400).json({ message: 'El formato del documento de identidad es inválido. Debe ser alfanumérico y tener entre 7 y 9 dígitos, opcionalmente con un prefijo (V-, E-, etc.).' });
    }

    if (numero_historia && !numeroHistoriaRegex.test(numero_historia)) {
      return res.status(400).json({ message: 'El formato del número de historia es inválido. Debe ser alfanumérico, opcionalmente con un prefijo (H-).' });
    }

    // Aplicar formateo a los campos antes de crear/actualizar
    const processedBody = {
      ...req.body,
      documento_identidad: formatDocumentoIdentidad(documento_identidad),
      numero_historia: formatNumeroHistoria(numero_historia)
    };

    const nuevoPaciente = await Paciente.create(processedBody);

    // --- Registro en Bitácora ---
    await Bitacora.create({ // Asegura que usuario_id sea válido o null
      usuario_id: req.session.user?.id || null,
      accion: 'CREACIÓN',
      tabla_afectada: 'pacientes',
      registro_id_afectado: nuevoPaciente.id,
      detalles: { nuevo_valor: nuevoPaciente }
    });
    // --- Fin Registro en Bitácora ---

     res.status(201).json(nuevoPaciente);
   } catch (error) {
     console.error('Error al crear paciente:', error);
    if (error.code === 'ER_DUP_ENTRY') {
       return res.status(409).json({ message: 'El documento de identidad ya está registrado.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const updatePaciente = async (req, res) => {
   try {
     const { id } = req.params;
     // Extraer los campos del cuerpo de la petición
     const { nombre, apellido, documento_identidad, numero_historia } = req.body || {};
     if (!nombre || !apellido || !documento_identidad) { // Validar campos obligatorios
       return res.status(400).json({ message: 'Los campos nombre, apellido y documento_identidad son obligatorios.' });
     }

    if (!documentoIdentidadRegex.test(documento_identidad)) {
      return res.status(400).json({ message: 'El formato del documento de identidad es inválido. Debe ser alfanumérico y tener entre 7 y 9 dígitos, opcionalmente con un prefijo (V-, E-, etc.).' });
    }

    if (numero_historia && !numeroHistoriaRegex.test(numero_historia)) {
      return res.status(400).json({ message: 'El formato del número de historia es inválido. Debe ser alfanumérico, opcionalmente con un prefijo (H-).' });
    }

    // Aplicar formateo a los campos antes de crear/actualizar
    const processedBody = {
      ...req.body,
      documento_identidad: formatDocumentoIdentidad(documento_identidad),
      numero_historia: formatNumeroHistoria(numero_historia)
    };

    const estadoAnterior = await Paciente.findById(id); // Obtener el estado anterior para la bitácora
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Paciente no encontrado para actualizar.' });
    }

    const affectedRows = await Paciente.update(id, processedBody);
     if (affectedRows === 0) { // Usar processedBody para la respuesta
       return res.status(404).json({ message: 'Paciente no encontrado o no se realizaron cambios.' });
     }

    // --- Registro en Bitácora ---
    await Bitacora.create({
      usuario_id: req.session.user?.id || null, // Asegura que usuario_id sea válido o null
      accion: 'ACTUALIZACIÓN',
      tabla_afectada: 'pacientes',
      registro_id_afectado: id,
      detalles: { valor_anterior: estadoAnterior, nuevo_valor: processedBody }
    });
    // --- Fin Registro en Bitácora ---

    res.json({ id: Number(id), ...processedBody });
   } catch (error) {
     console.error(`Error al actualizar paciente ${req.params.id}:`, error);
     if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El documento de identidad o número de historia ya está registrado para otro paciente.' });
     }
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

 const deletePaciente = async (req, res) => {
   try {
     const { id } = req.params;

    const estadoAnterior = await Paciente.findById(id);
    if (!estadoAnterior) {
      return res.status(404).json({ message: 'Paciente no encontrado para eliminar.' });
    }

    // --- Eliminación Lógica (Soft Delete) ---
    // En lugar de borrar, cambiamos el estado a inactivo para mantener la consistencia.
    const affectedRows = await Paciente.update(id, { activo: false });
     if (affectedRows === 0) { // Usar processedBody para la respuesta
       return res.status(404).json({ message: 'Paciente no encontrado.' });
     }

    // --- Registro en Bitácora ---
    await Bitacora.create({ // Asegura que usuario_id sea válido o null
      usuario_id: req.session.user?.id || null,
      accion: 'ELIMINACIÓN',
      tabla_afectada: 'pacientes',
      registro_id_afectado: id,
      detalles: { valor_desactivado: estadoAnterior }
    });
    // --- Fin Registro en Bitácora ---

     res.status(204).send();
   } catch (error) {
     console.error(`Error al eliminar paciente ${req.params.id}:`, error);
     // El error de referencia (ER_ROW_IS_REFERENCED_2) ya no debería ocurrir con el borrado lógico.
     res.status(500).json({ message: 'Error interno del servidor.' });
   }
 };

const searchPacientes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'El parámetro de búsqueda "q" es obligatorio.' });
    }
    // Modificado para buscar solo entre pacientes activos
    const pacientes = await Paciente.search(q, { activo: true });
    res.json(pacientes);
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

 module.exports = {
   getAllPacientes,
   getPacienteById,
   createPaciente,
   updatePaciente,
  deletePaciente,
  searchPacientes
 };
