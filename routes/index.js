const express = require('express');
const router = express.Router();

// Usuario de prueba
const usuarios = [
  { username: 'admin', password: '1234' }
];

// Ruta de login (GET)
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesión', error: null });
});

// Ruta de login (POST)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.usuario = user;
    res.redirect('/clientes'); // redirige donde tú quieras
  } else {
    res.render('login', { title: 'Iniciar sesión', error: 'Credenciales incorrectas' });
  }
});

// Ruta logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
