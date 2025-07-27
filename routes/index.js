const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

// Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${3000}`);
});

// 📄 routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'));
router.get('/clientes', (req, res) => res.render('clientes'));
router.get('/envios', (req, res) => res.render('envios'));
router.get('/casetas', (req, res) => res.render('casetas'));
router.get('/historial', (req, res) => res.render('historial'));

module.exports = router;