// src/modules/malla/malla.routes.js
const express = require('express');
const router = express.Router();
const mallaController = require('./malla.controller');

router.get(
  '/facultad/:facultad_codigo/carrera/:carrera_codigo',
  mallaController.listarMallaPorCarrera
);

router.post(
  '/',
  mallaController.crearMalla
);

router.put(
  '/:facultad_codigo/:carrera_codigo/:materia_codigo',
  mallaController.actualizarMalla
);

router.delete(
  '/:facultad_codigo/:carrera_codigo/:materia_codigo',
  mallaController.eliminarMalla
);

module.exports = router;
