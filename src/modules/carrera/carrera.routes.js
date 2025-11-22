// src/modules/carrera/carrera.routes.js
const express = require('express');
const controller = require('./carrera.controller');

const router = express.Router();

// GET /carreras
router.get('/', controller.listarCarreras);

// GET /carreras/facultad/:facultadCodigo
router.get('/facultad/:facultadCodigo', controller.listarCarrerasPorFacultad);

// GET /carreras/:facultadCodigo/:codigo
router.get('/:facultadCodigo/:codigo', controller.obtenerCarrera);

// POST /carreras
router.post('/', controller.crearCarrera);

// PUT /carreras/:facultadCodigo/:codigo
router.put('/:facultadCodigo/:codigo', controller.actualizarCarrera);

// DELETE /carreras/:facultadCodigo/:codigo
router.delete('/:facultadCodigo/:codigo', controller.eliminarCarrera);

module.exports = router;
