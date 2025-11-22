// src/modules/facultad/facultad.routes.js
const express = require('express');
const controller = require('./facultad.controller');

const router = express.Router();

// Rutas base: /facultades
router.get('/', controller.listarFacultades);
router.get('/:codigo', controller.obtenerFacultad);
router.post('/', controller.crearFacultad);
router.put('/:codigo', controller.actualizarFacultad);
router.delete('/:codigo', controller.eliminarFacultad);

module.exports = router;
