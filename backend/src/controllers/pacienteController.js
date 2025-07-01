const pool = require('../config/db');
const bitacoraService = require('../services/bitacoraService');

const getAllPacientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes ORDER BY apellido ASC, nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createPaciente = async (req, res) => {
    const { nombre, apellido, documento_identidad, numero_historia } = req.body;
    const usuario_id = req.user.id;

    if (!nombre || !apellido || !documento_identidad) {
        return res.status(400).json({ message: 'Nombre, apellido y documento son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO pacientes (nombre, apellido, documento_identidad, numero_historia) VALUES (?, ?, ?, ?)',
            [nombre, apellido, documento_identidad, numero_historia || null]
        );
        const nuevoId = result.insertId;
        const [nuevoPaciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [nuevoId]);
        await bitacoraService.logAction(usuario_id, 'CREACIÓN', 'pacientes', nuevoId, { nuevo_valor: nuevoPaciente[0] });
        res.status(201).json(nuevoPaciente[0]);
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, documento_identidad, numero_historia } = req.body;
    const usuario_id = req.user.id;

    try {
        const [valorAnterior] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        if (valorAnterior.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado.' });
        }

        await pool.query(
            'UPDATE pacientes SET nombre = ?, apellido = ?, documento_identidad = ?, numero_historia = ? WHERE id = ?',
            [nombre, apellido, documento_identidad, numero_historia || null, id]
        );

        const [nuevoValor] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        await bitacoraService.logAction(usuario_id, 'ACTUALIZACIÓN', 'pacientes', id, { valor_anterior: valorAnterior[0], nuevo_valor: nuevoValor[0] });
        res.json(nuevoValor[0]);
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const deletePaciente = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;
    try {
        const [valorAnterior] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        if (valorAnterior.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado.' });
        }
        await pool.query('DELETE FROM pacientes WHERE id = ?', [id]);
        await bitacoraService.logAction(usuario_id, 'ELIMINACIÓN', 'pacientes', id, { valor_eliminado: valorAnterior[0] });
        res.status(200).json({ message: 'Paciente eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'No se puede eliminar el paciente porque tiene tratamientos asociados.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
  getAllPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente
};
