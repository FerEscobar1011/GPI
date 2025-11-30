// src/app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

// Rutas por módulo
const facultadRoutes = require('./modules/facultad/facultad.routes');
const carreraRoutes  = require('./modules/carrera/carrera.routes');
const materiaRoutes  = require('./modules/materia/materia.routes');
const mallaRoutes    = require('./modules/malla/malla.routes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos del front (carpeta public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint base para probar que el server funciona
app.get('/api', (req, res) => {
  res.json({
    message: 'API simple con Node.js + Postgres (modular, sin auth)',
    modules: ['facultades', 'carreras', 'materias', 'malla'],
  });
});

// Montar módulos
app.use('/facultades', facultadRoutes);
app.use('/carreras', carreraRoutes);
app.use('/materias', materiaRoutes);
app.use('/malla', mallaRoutes);   // <--- corregido (singular)

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Front:           http://localhost:${PORT}/`);
  console.log(`API Facultad:    http://localhost:${PORT}/facultades`);
  console.log(`API Carrera:     http://localhost:${PORT}/carreras`);
  console.log(`API Materia:     http://localhost:${PORT}/materias`);
  console.log(`API Malla:       http://localhost:${PORT}/malla`);
});

module.exports = app;
