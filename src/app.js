// src/app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const facultadRoutes = require('./modules/facultad/facultad.routes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos del front (carpeta public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint base para probar que el server funciona
app.get('/api', (req, res) => {
  res.json({ message: 'API simple con Node.js + Postgres (modular, sin auth)' });
});

// Montar módulo Facultad bajo /facultades
app.use('/facultades', facultadRoutes);

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Front: http://localhost:${PORT}/`);
  console.log(`API:   http://localhost:${PORT}/facultades`);
});
