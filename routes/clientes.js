const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/', clientesController.getClientes);
// Otros endpoints (get/:id, post, put, delete) si los necesitas

module.exports = router;
