const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio');
const mongoose = require('mongoose');
const cors = require('cors'); // Importar el paquete CORS

// Usar CORS middleware
router.use(cors());

// Ruta para obtener todos los portafolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener un portafolio por su ID
router.get('/:id', getPortfolio, (req, res) => {
  res.json(res.portfolio);
});

// Ruta para crear un nuevo portafolio
router.post('/', async (req, res) => {
  const portfolio = new Portfolio({
    title: req.body.title,
    description: req.body.description,
    link: req.body.link
  });

  try {
    const newPortfolio = await portfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para actualizar un portafolio por su ID
router.put('/:id', getPortfolio, async (req, res) => {
  if (req.body.title != null) {
    res.portfolio.title = req.body.title;
  }
  if (req.body.description != null) {
    res.portfolio.description = req.body.description;
  }
  if (req.body.link != null) {
    res.portfolio.link = req.body.link;
  }

  try {
    const updatedPortfolio = await res.portfolio.save();
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para eliminar un portafolio por su ID
router.delete('/:id', getPortfolio, async (req, res) => {
  try {
    await res.portfolio.remove();
    res.json({ message: 'Portafolio eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un portafolio por su ID
async function getPortfolio(req, res, next) {
  let portfolio;
  const id = req.params.id;

  try {
    // Utiliza directamente el ID como una cadena en la función findById
    portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return res.status(404).json({ message: 'No se encontró el portafolio' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.portfolio = portfolio;
  next();
}

module.exports = router;
