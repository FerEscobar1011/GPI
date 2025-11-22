// src/modules/carrera/carrera.controller.js
const db = require('../../db');

/**
 * GET /carreras
 * Lista todas las carreras
 */
async function listarCarreras(req, res) {
  try {
    const result = await db.query(
      `SELECT facultad_codigo, codigo, descripcion
       FROM carreras
       ORDER BY facultad_codigo ASC, codigo ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar carreras:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /carreras/facultad/:facultadCodigo
 * Lista todas las carreras de una facultad
 */
async function listarCarrerasPorFacultad(req, res) {
  const facultadCodigo = req.params.facultadCodigo;

  try {
    const result = await db.query(
      `SELECT facultad_codigo, codigo, descripcion
       FROM carreras
       WHERE facultad_codigo = $1
       ORDER BY codigo ASC`,
      [facultadCodigo]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar carreras por facultad:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /carreras/:facultadCodigo/:codigo
 * Obtiene una carrera específica
 */
async function obtenerCarrera(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      `SELECT facultad_codigo, codigo, descripcion
       FROM carreras
       WHERE facultad_codigo = $1 AND codigo = $2`,
      [facultadCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener carrera:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /carreras
 * Crea una nueva carrera
 * Body JSON:
 * {
 *   "facultad_codigo": "FI",
 *   "codigo": "INF",
 *   "descripcion": "Ingeniería Informática"
 * }
 */
async function crearCarrera(req, res) {
  const { facultad_codigo, codigo, descripcion } = req.body;

  if (!facultad_codigo || String(facultad_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo facultad_codigo es obligatorio' });
  }

  if (!codigo || String(codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo codigo es obligatorio' });
  }

  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      `INSERT INTO carreras (facultad_codigo, codigo, descripcion)
       VALUES ($1, $2, $3)
       RETURNING facultad_codigo, codigo, descripcion`,
      [
        String(facultad_codigo).trim(),
        String(codigo).trim(),
        String(descripcion).trim(),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear carrera:', err);

    // PK repetida
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe una carrera con ese código en esa facultad',
      });
    }

    // Si falla por FK de facultad inexistente
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'La facultad especificada no existe',
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /carreras/:facultadCodigo/:codigo
 * Actualiza la descripción de una carrera
 * Body JSON:
 * {
 *   "descripcion": "Nuevo nombre"
 * }
 */
async function actualizarCarrera(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const codigo = req.params.codigo;
  const { descripcion } = req.body;

  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      `UPDATE carreras
       SET descripcion = $1
       WHERE facultad_codigo = $2 AND codigo = $3
       RETURNING facultad_codigo, codigo, descripcion`,
      [String(descripcion).trim(), facultadCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar carrera:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * DELETE /carreras/:facultadCodigo/:codigo
 * Elimina una carrera
 */
async function eliminarCarrera(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      `DELETE FROM carreras
       WHERE facultad_codigo = $1 AND codigo = $2
       RETURNING facultad_codigo, codigo`,
      [facultadCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar carrera:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  listarCarreras,
  listarCarrerasPorFacultad,
  obtenerCarrera,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
};
