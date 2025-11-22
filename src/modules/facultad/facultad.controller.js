// src/modules/facultad/facultad.controller.js
const db = require('../../db');

/**
 * GET /facultades
 * Lista todas las facultades
 */
async function listarFacultades(req, res) {
  try {
    const result = await db.query(
      'SELECT codigo, descripcion FROM facultades ORDER BY codigo ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar facultades:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /facultades/:codigo
 * Obtiene una facultad por su código
 */
async function obtenerFacultad(req, res) {
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      'SELECT codigo, descripcion FROM facultades WHERE codigo = $1',
      [codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener facultad:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /facultades
 * Crea una nueva facultad
 * Body JSON: { "codigo": "FI", "descripcion": "Facultad de Ingeniería" }
 */
async function crearFacultad(req, res) {
  const { codigo, descripcion } = req.body;

  if (!codigo || String(codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo codigo es obligatorio' });
  }

  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      'INSERT INTO facultades (codigo, descripcion) VALUES ($1, $2) RETURNING codigo, descripcion',
      [String(codigo).trim(), String(descripcion).trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear facultad:', err);

    // Si hay conflicto de PK
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una facultad con ese código' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /facultades/:codigo
 * Actualiza la descripción de una facultad
 * Body JSON: { "descripcion": "Nuevo texto" }
 */
async function actualizarFacultad(req, res) {
  const codigo = req.params.codigo;
  const { descripcion } = req.body;

  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      'UPDATE facultades SET descripcion = $1 WHERE codigo = $2 RETURNING codigo, descripcion',
      [String(descripcion).trim(), codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar facultad:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * DELETE /facultades/:codigo
 * Elimina una facultad
 */
async function eliminarFacultad(req, res) {
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      'DELETE FROM facultades WHERE codigo = $1 RETURNING codigo',
      [codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    res.json({ message: 'Facultad eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar facultad:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  listarFacultades,
  obtenerFacultad,
  crearFacultad,
  actualizarFacultad,
  eliminarFacultad,
};
