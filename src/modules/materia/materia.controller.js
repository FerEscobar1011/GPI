// src/modules/materia/materia.controller.js
const db = require('../../db');

/**
 * GET /materias
 * Lista todas las materias
 */
async function listarMaterias(req, res) {
  try {
    const result = await db.query(
      `SELECT facultad_codigo, carrera_codigo, codigo, descripcion
       FROM materias
       ORDER BY facultad_codigo, carrera_codigo, codigo`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar materias:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /materias/facultad/:facultadCodigo/carrera/:carreraCodigo
 * Lista todas las materias de una carrera específica
 */
async function listarMateriasPorCarrera(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const carreraCodigo = req.params.carreraCodigo;

  try {
    const result = await db.query(
      `SELECT facultad_codigo, carrera_codigo, codigo, descripcion
       FROM materias
       WHERE facultad_codigo = $1 AND carrera_codigo = $2
       ORDER BY codigo ASC`,
      [facultadCodigo, carreraCodigo]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar materias por carrera:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /materias/:facultadCodigo/:carreraCodigo/:codigo
 * Obtiene una materia específica
 */
async function obtenerMateria(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const carreraCodigo = req.params.carreraCodigo;
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      `SELECT facultad_codigo, carrera_codigo, codigo, descripcion
       FROM materias
       WHERE facultad_codigo = $1 AND carrera_codigo = $2 AND codigo = $3`,
      [facultadCodigo, carreraCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener materia:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /materias
 * Crea una nueva materia
 * Body JSON:
 * {
 *   "facultad_codigo": "FI",
 *   "carrera_codigo": "INF",
 *   "codigo": "MAT1",
 *   "descripcion": "Matemática I"
 * }
 */
async function crearMateria(req, res) {
  const { facultad_codigo, carrera_codigo, codigo, descripcion } = req.body;

  if (!facultad_codigo || String(facultad_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo facultad_codigo es obligatorio' });
  }
  if (!carrera_codigo || String(carrera_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo carrera_codigo es obligatorio' });
  }
  if (!codigo || String(codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo codigo es obligatorio' });
  }
  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      `INSERT INTO materias (facultad_codigo, carrera_codigo, codigo, descripcion)
       VALUES ($1, $2, $3, $4)
       RETURNING facultad_codigo, carrera_codigo, codigo, descripcion`,
      [
        String(facultad_codigo).trim(),
        String(carrera_codigo).trim(),
        String(codigo).trim(),
        String(descripcion).trim()
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear materia:', err);

    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe una materia con ese código en esa carrera',
      });
    }

    if (err.code === '23503') {
      return res.status(400).json({
        error: 'La carrera especificada no existe (facultad_codigo + carrera_codigo inválidos)',
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /materias/:facultadCodigo/:carreraCodigo/:codigo
 * Actualiza la descripción de una materia
 * Body JSON:
 * {
 *   "descripcion": "Nuevo nombre"
 * }
 */
async function actualizarMateria(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const carreraCodigo = req.params.carreraCodigo;
  const codigo = req.params.codigo;
  const { descripcion } = req.body;

  if (!descripcion || String(descripcion).trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  try {
    const result = await db.query(
      `UPDATE materias
       SET descripcion = $1
       WHERE facultad_codigo = $2 AND carrera_codigo = $3 AND codigo = $4
       RETURNING facultad_codigo, carrera_codigo, codigo, descripcion`,
      [String(descripcion).trim(), facultadCodigo, carreraCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar materia:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * DELETE /materias/:facultadCodigo/:carreraCodigo/:codigo
 * Elimina una materia
 */
async function eliminarMateria(req, res) {
  const facultadCodigo = req.params.facultadCodigo;
  const carreraCodigo = req.params.carreraCodigo;
  const codigo = req.params.codigo;

  try {
    const result = await db.query(
      `DELETE FROM materias
       WHERE facultad_codigo = $1 AND carrera_codigo = $2 AND codigo = $3
       RETURNING facultad_codigo, carrera_codigo, codigo`,
      [facultadCodigo, carreraCodigo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    res.json({ message: 'Materia eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar materia:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  listarMaterias,
  listarMateriasPorCarrera,
  obtenerMateria,
  crearMateria,
  actualizarMateria,
  eliminarMateria,
};
