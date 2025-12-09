// src/modules/malla/malla.routes.js
const express = require('express');
const router = express.Router();
const mallaController = require('./malla.controller');

// Lista malla de una carrera + promo
router.get(
  '/facultad/:facultad_codigo/carrera/:carrera_codigo/promo/:promo',
  mallaController.listarMallaPorCarreraPromo
);

// Crea registro de malla (una materia en la malla)
router.post('/', mallaController.crearMalla);

// Actualiza un registro de malla
router.put(
  '/:facultad_codigo/:carrera_codigo/:promo/:materia_codigo',
  mallaController.actualizarMalla
);

// Elimina un registro de malla
router.delete(
  '/:facultad_codigo/:carrera_codigo/:promo/:materia_codigo',
  mallaController.eliminarMalla
);

module.exports = router;
