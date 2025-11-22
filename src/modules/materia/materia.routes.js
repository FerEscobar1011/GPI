// src/modules/materia/materia.routes.js
const express = require('express');
const controller = require('./materia.controller');

const router = express.Router();

// GET /materias
router.get('/', controller.listarMaterias);

// GET /materias/facultad/:facultadCodigo/carrera/:carreraCodigo
router.get('/facultad/:facultadCodigo/carrera/:carreraCodigo', controller.listarMateriasPorCarrera);

// GET /materias/:facultadCodigo/:carreraCodigo/:codigo
router.get('/:facultadCodigo/:carreraCodigo/:codigo', controller.obtenerMateria);

// POST /materias
router.post('/', controller.crearMateria);

// PUT /materias/:facultadCodigo/:carreraCodigo/:codigo
router.put('/:facultadCodigo/:carreraCodigo/:codigo', controller.actualizarMateria);

// DELETE /materias/:facultadCodigo/:carreraCodigo/:codigo
router.delete('/:facultadCodigo/:carreraCodigo/:codigo', controller.eliminarMateria);

module.exports = router;
