// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Importa dotenv para cargar las variables de entorno
const portfolioRoutes = require('./routes/portfolioRoutes');

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Configura la conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Usa las rutas definidas en portfolioRoutes.js
app.use('/api/portfolios', portfolioRoutes);

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Manejador de errores para otros errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
