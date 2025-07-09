const SesionCaja = require('../models/sesionCajaModel.js');

/**
 * Obtiene el estado actual de la caja (si hay una sesión abierta).
 */
const getEstadoCaja = async (req, res) => {
  try {
    const sesionAbierta = await SesionCaja.findOpenSession();
    if (sesionAbierta) {
      // Nueva lógica de permisos
      const esPropietario = sesionAbierta.usuario_id === req.user.id;
      const esAdmin = req.user.rol.toLowerCase() === 'administrador'; // Usamos toLowerCase para ser robustos

      if (esPropietario || esAdmin) {
        // Si es el dueño o un admin, puede ver todo.
        res.json({ estado: 'ABIERTA', sesion: sesionAbierta });
      } else {
        // Si es otro usuario, solo le informamos que está ocupada.
        res.json({ estado: 'ABIERTA_POR_OTRO', sesion: { nombre_usuario: sesionAbierta.nombre_usuario } });
      }
    } else {
      res.json({ estado: 'CERRADA', sesion: null });
    }
  } catch (error) {
    console.error('Error al obtener estado de la caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Abre una nueva sesión de caja.
 */
const abrirCaja = async (req, res) => {
  try {
    const sesionAbierta = await SesionCaja.findOpenSession();
    if (sesionAbierta) {
      return res.status(409).json({ message: 'Ya existe una sesión de caja abierta.' });
    }

    const { montos_apertura } = req.body;
    if (!montos_apertura || typeof montos_apertura !== 'object') {
      return res.status(400).json({ message: 'Los montos de apertura son requeridos.' });
    }

    const usuario_id = req.user.id; // Obtenido del middleware de autenticación
    const nuevaSesionId = await SesionCaja.create(usuario_id, montos_apertura);
    const nuevaSesion = await SesionCaja.findById(nuevaSesionId); // findById ahora hace el JOIN

    res.status(201).json({ message: 'Caja abierta exitosamente.', sesion: nuevaSesion });
  } catch (error) {
    console.error('Error al abrir la caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Cierra la sesión de caja activa. Solo para administradores.
 */
const cerrarCaja = async (req, res) => {
  // La validación de rol de administrador se debe hacer en un middleware en la ruta.
  try {
    const sesionAbierta = await SesionCaja.findOpenSession();
    if (!sesionAbierta) {
      return res.status(404).json({ message: 'No hay ninguna sesión de caja abierta para cerrar.' });
    }

    const { montos_cierre_real, notas } = req.body;
    if (!montos_cierre_real || typeof montos_cierre_real !== 'object') {
      return res.status(400).json({ message: 'Los montos de cierre real son requeridos.' });
    }

    // --- Lógica de cálculo para múltiples métodos de pago ---
    const montos_apertura = sesionAbierta.montos_apertura; // Esto ya es un objeto
    const totalIngresos = await SesionCaja.calculateTotalPaymentsForSession(sesionAbierta.fecha_apertura); // Objeto con totales por método

    // Unimos todas las claves de los métodos de pago para no omitir ninguna
    const metodos = [...new Set([...Object.keys(montos_apertura), ...Object.keys(totalIngresos), ...Object.keys(montos_cierre_real)])];

    const montos_cierre_calculado = {};
    const diferencias = {};

    for (const metodo of metodos) {
      const apertura = Number(montos_apertura[metodo]) || 0;
      const ingresos = Number(totalIngresos[metodo]) || 0;
      const real = Number(montos_cierre_real[metodo]) || 0;

      const calculado = apertura + ingresos;
      montos_cierre_calculado[metodo] = calculado;
      diferencias[metodo] = real - calculado;
    }
    // --- Fin de la lógica de cálculo ---

    const datosCierre = {
      montos_cierre_calculado,
      montos_cierre_real,
      diferencias,
      notas
    };

    await SesionCaja.close(sesionAbierta.id, datosCierre);
    res.json({ message: 'Caja cerrada exitosamente.' });
  } catch (error) {
    console.error('Error al cerrar la caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getEstadoCaja,
  abrirCaja,
  cerrarCaja,
};