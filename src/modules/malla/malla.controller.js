// src/modules/malla/malla.controller.js
const db = require('../../db');

/**
 * GET /malla/facultad/:facultad_codigo/carrera/:carrera_codigo/promo/:promo
 * Lista la malla (materias) de una carrera y promo
 */
async function listarMallaPorCarreraPromo(req, res) {
  const { facultad_codigo, carrera_codigo, promo } = req.params;

  try {
    const result = await db.query(
      `SELECT 
         m.facultad_codigo,
         m.carrera_codigo,
         m.promo,
         m.materia_codigo,
         m.anio,
         m.semestre,
         m.tipo,
         mat.descripcion AS materia_descripcion
       FROM malla m
       JOIN materias mat
         ON mat.facultad_codigo = m.facultad_codigo
        AND mat.codigo          = m.materia_codigo
       WHERE m.facultad_codigo = $1
         AND m.carrera_codigo  = $2
         AND m.promo           = $3
       ORDER BY m.anio, m.semestre, m.materia_codigo`,
      [facultad_codigo, carrera_codigo, Number(promo)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar malla:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /malla
 * Crea un nuevo registro de malla (agrega una materia a la malla de una carrera)
 * Body JSON:
 * {
 *   "facultad_codigo": "FI",
 *   "carrera_codigo": "INF",
 *   "promo": 2025,
 *   "materia_codigo": "MAT1",
 *   "anio": 1,
 *   "semestre": 1,
 *   "tipo": "OBLIGATORIA"
 * }
 */
async function crearMalla(req, res) {
  const {
    facultad_codigo,
    carrera_codigo,
    promo,
    materia_codigo,
    anio,
    semestre,
    tipo,
  } = req.body;

  // Validaciones
  if (!facultad_codigo || String(facultad_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo facultad_codigo es obligatorio' });
  }
  if (!carrera_codigo || String(carrera_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo carrera_codigo es obligatorio' });
  }
  if (promo == null || isNaN(Number(promo))) {
    return res.status(400).json({ error: 'El campo promo es obligatorio y debe ser numérico' });
  }
  if (!materia_codigo || String(materia_codigo).trim() === '') {
    return res.status(400).json({ error: 'El campo materia_codigo es obligatorio' });
  }
  if (anio == null || isNaN(Number(anio))) {
    return res.status(400).json({ error: 'El campo anio es obligatorio y debe ser numérico' });
  }
  if (semestre == null || isNaN(Number(semestre))) {
    return res.status(400).json({ error: 'El campo semestre es obligatorio y debe ser numérico' });
  }
  if (!tipo || String(tipo).trim() === '') {
    return res.status(400).json({ error: 'El campo tipo es obligatorio' });
  }

  try {
    const result = await db.query(
      `INSERT INTO malla (
         facultad_codigo,
         carrera_codigo,
         promo,
         materia_codigo,
         anio,
         semestre,
         tipo
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING facultad_codigo, carrera_codigo, promo, materia_codigo, anio, semestre, tipo`,
      [
        String(facultad_codigo).trim(),
        String(carrera_codigo).trim(),
        Number(promo),
        String(materia_codigo).trim(),
        Number(anio),
        Number(semestre),
        String(tipo).trim(),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear registro de malla:', err);

    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un registro de malla para esa facultad/carrera/promo/materia',
      });
    }

    if (err.code === '23503') {
      return res.status(400).json({
        error: 'La facultad, carrera o materia asociada no existe (violación de clave foránea)',
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /malla/:facultad_codigo/:carrera_codigo/:promo/:materia_codigo
 * Actualiza anio, semestre, tipo de un registro de malla
 * Body JSON:
 * { "anio": 2, "semestre": 1, "tipo": "OBLIGATORIA" }
 */
async function actualizarMalla(req, res) {
  const { facultad_codigo, carrera_codigo, promo, materia_codigo } = req.params;
  const { anio, semestre, tipo } = req.body;

  if (anio == null || isNaN(Number(anio))) {
    return res.status(400).json({ error: 'El campo anio es obligatorio y debe ser numérico' });
  }
  if (semestre == null || isNaN(Number(semestre))) {
    return res.status(400).json({ error: 'El campo semestre es obligatorio y debe ser numérico' });
  }
  if (!tipo || String(tipo).trim() === '') {
    return res.status(400).json({ error: 'El campo tipo es obligatorio' });
  }

  try {
    const result = await db.query(
      `UPDATE malla
       SET anio     = $5,
           semestre = $6,
           tipo     = $7
       WHERE facultad_codigo = $1
         AND carrera_codigo  = $2
         AND promo           = $3
         AND materia_codigo  = $4
       RETURNING facultad_codigo, carrera_codigo, promo, materia_codigo, anio, semestre, tipo`,
      [
        facultad_codigo,
        carrera_codigo,
        Number(promo),
        materia_codigo,
        Number(anio),
        Number(semestre),
        String(tipo).trim(),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de malla no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar malla:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * DELETE /malla/:facultad_codigo/:carrera_codigo/:promo/:materia_codigo
 * Elimina un registro de malla
 */
async function eliminarMalla(req, res) {
  const { facultad_codigo, carrera_codigo, promo, materia_codigo } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM malla
       WHERE facultad_codigo = $1
         AND carrera_codigo  = $2
         AND promo           = $3
         AND materia_codigo  = $4
       RETURNING facultad_codigo, carrera_codigo, promo, materia_codigo`,
      [facultad_codigo, carrera_codigo, Number(promo), materia_codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de malla no encontrado' });
    }

    res.json({ message: 'Registro de malla eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar malla:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  listarMallaPorCarreraPromo,
  crearMalla,
  actualizarMalla,
  eliminarMalla,
};
