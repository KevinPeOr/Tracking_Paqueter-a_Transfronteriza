require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { sql, config } = require('./db');  // importas config y sql

const app = express();

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Middleware para parsear datos del body
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
  secret: 'mi_secreto_seguro',
  resave: false,
  saveUninitialized: true
}));

// Configuración EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

// Middleware para proteger rutas
function protegerRuta(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// Ruta de login
app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: null });
});

app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Aquí pon tu lógica real de autenticación, por ejemplo:
  if (usuario === 'admin' && password === '1234') {
    req.session.usuario = usuario;
    res.redirect('/clientes');
  } else {
    res.render('login', { title: 'Iniciar Sesión', error: 'Credenciales incorrectas' });
  }
});



// Ruta de logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Rutas conectadas a la base de datos
app.get('/clientes', protegerRuta, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    // Consulta con columnas que sí existen en tu tabla
    let result = await pool.request().query('SELECT id_cliente, nombre, correo_electronico FROM clientes');
    res.render('clientes', { title: 'Clientes', clientes: result.recordset });
  } catch (err) {
    console.error('Error en consulta clientes:', err);
    res.status(500).send('Error al obtener clientes');
  }
});

app.get('/envios', protegerRuta, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT id_envio, numero_guia, estado_actual FROM envios');
    res.render('envios', { title: 'Envíos', envios: result.recordset });
  } catch (err) {
    console.error('Error en consulta envios:', err);
    res.status(500).send('Error al obtener envíos');
  }
});

app.get('/casetas', protegerRuta, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT id_caseta, nombre, tipo FROM casetas');
    res.render('casetas', { title: 'Casetas', casetas: result.recordset });
  } catch (err) {
    console.error('Error en consulta casetas:', err);
    res.status(500).send('Error al obtener casetas');
  }
});

app.get('/historial', protegerRuta, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT id_historial, id_envio, id_estado, fecha_cambio FROM historial_estados');
    res.render('historial', { title: 'Historial', historial: result.recordset });
  } catch (err) {
    console.error('Error en consulta historial:', err);
    res.status(500).send('Error al obtener historial');
  }
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
