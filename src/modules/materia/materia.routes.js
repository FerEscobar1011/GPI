// src/modules/materia/materia.routes.js
const express = require('express');
const router = express.Router();

const {
  listarMaterias,
  listarMateriasPorFacultad,
  obtenerMateria,
  crearMateria,
  actualizarMateria,
  eliminarMateria,
} = require('./materia.controller');

// Lista todas las materias
router.get('/', listarMaterias);

// Lista materias por facultad
// GET /materias/facultad/FI
router.get('/facultad/:facultadCodigo', listarMateriasPorFacultad);

// Obtiene una materia específica
// GET /materias/FI/MAT1
router.get('/:facultadCodigo/:codigo', obtenerMateria);

// Crea materia
// POST /materias
router.post('/', crearMateria);

// Actualiza materia
// PUT /materias/FI/MAT1
router.put('/:facultadCodigo/:codigo', actualizarMateria);

// Elimina materia
// DELETE /materias/FI/MAT1
router.delete('/:facultadCodigo/:codigo', eliminarMateria);

module.exports = router;
