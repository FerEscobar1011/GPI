// src/app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

// Rutas de módulos
const facultadRoutes = require('./modules/facultad/facultad.routes');
const carreraRoutes  = require('./modules/carrera/carrera.routes');
const materiaRoutes  = require('./modules/materia/materia.routes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos del front (carpeta public a nivel raíz del proyecto)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint base para probar que el server funciona
app.get('/api', (req, res) => {
  res.json({ message: 'API simple con Node.js + Postgres (modular, sin auth)' });
});

// ─────────────────────────────
// Montar módulos
// ─────────────────────────────

// Facultades -> /facultades/...
app.use('/facultades', facultadRoutes);

// Carreras -> /carreras/...
app.use('/carreras', carreraRoutes);

// Materias -> /materias/...
app.use('/materias', materiaRoutes);

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Front:          http://localhost:${PORT}/`);
  console.log(`API Facultades: http://localhost:${PORT}/facultades`);
  console.log(`API Carreras:   http://localhost:${PORT}/carreras`);
  console.log(`API Materias:   http://localhost:${PORT}/materias`);
});
