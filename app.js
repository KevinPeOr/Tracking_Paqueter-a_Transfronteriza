require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { sql, config } = require('./db');  // importas config y sql

// ✨ NUEVAS DEPENDENCIAS PARA SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// ✨ CONFIGURACIÓN DE SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tracking Paquetería Transfronteriza API',
      version: '1.0.0',
      description: 'API para sistema de tracking de paquetería transfronteriza entre Tijuana y Estados Unidos',
      contact: {
        name: 'Kevin Peña',
        url: 'https://github.com/KevinPeOr/Tracking_Paqueter-a_Transfronteriza'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./app.js'], // archivos donde están tus rutas
};

const specs = swaggerJsdoc(swaggerOptions);

// ✨ MIDDLEWARE DE SWAGGER (antes de las rutas)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customSiteTitle: "Tracking Paquetería API",
  customfavIcon: "/favicon.ico",
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
  ]
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página principal
 *     description: Redirecciona automáticamente a la página de login
 *     responses:
 *       302:
 *         description: Redirección a /login
 */
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

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Página de login
 *     description: Muestra el formulario de inicio de sesión
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Página de login renderizada correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "Página HTML con formulario de login"
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "1234"
 *     responses:
 *       302:
 *         description: Redirección a /clientes si la autenticación es exitosa
 *       200:
 *         description: Página de login con mensaje de error si fallan las credenciales
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Cerrar sesión
 *     description: Destruye la sesión del usuario y lo redirige al login
 *     tags: [Autenticación]
 *     responses:
 *       302:
 *         description: Redirección a /login después de cerrar sesión
 */
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener lista de clientes
 *     description: Retorna todos los clientes registrados en el sistema. Requiere autenticación.
 *     tags: [Clientes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes renderizada en página HTML
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Página HTML con tabla de clientes
 *       302:
 *         description: Redirección a /login si no está autenticado
 *       500:
 *         description: Error del servidor al obtener clientes
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error al obtener clientes"
 */
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

/**
 * @swagger
 * /envios:
 *   get:
 *     summary: Obtener lista de envíos
 *     description: Retorna todos los envíos registrados en el sistema. Requiere autenticación.
 *     tags: [Envíos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de envíos renderizada en página HTML
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Página HTML con tabla de envíos
 *       302:
 *         description: Redirección a /login si no está autenticado
 *       500:
 *         description: Error del servidor al obtener envíos
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error al obtener envíos"
 */
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

/**
 * @swagger
 * /casetas:
 *   get:
 *     summary: Obtener lista de casetas
 *     description: Retorna todas las casetas de control registradas en el sistema. Requiere autenticación.
 *     tags: [Casetas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de casetas renderizada en página HTML
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Página HTML con tabla de casetas
 *       302:
 *         description: Redirección a /login si no está autenticado
 *       500:
 *         description: Error del servidor al obtener casetas
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error al obtener casetas"
 */
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

/**
 * @swagger
 * /historial:
 *   get:
 *     summary: Obtener historial de estados
 *     description: Retorna el historial completo de cambios de estado de todos los envíos. Requiere autenticación.
 *     tags: [Historial]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Historial de estados renderizado en página HTML
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Página HTML con tabla de historial
 *       302:
 *         description: Redirección a /login si no está autenticado
 *       500:
 *         description: Error del servidor al obtener historial
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error al obtener historial"
 */
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *       description: Autenticación basada en sesiones de Express
 *   
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id_cliente:
 *           type: integer
 *           description: ID único del cliente
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre completo del cliente
 *           example: "Juan Pérez"
 *         correo_electronico:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *           example: "juan.perez@correo.com"
 *     
 *     Envio:
 *       type: object
 *       properties:
 *         id_envio:
 *           type: integer
 *           description: ID único del envío
 *           example: 1
 *         numero_guia:
 *           type: string
 *           description: Número de guía de tracking
 *           example: "TJ20250001"
 *         estado_actual:
 *           type: integer
 *           description: ID del estado actual del envío
 *           example: 2
 *     
 *     Caseta:
 *       type: object
 *       properties:
 *         id_caseta:
 *           type: integer
 *           description: ID único de la caseta
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre de la caseta
 *           example: "Caseta Tijuana-Tecate"
 *         tipo:
 *           type: string
 *           description: Tipo de caseta
 *           example: "peaje"
 *     
 *     HistorialEstado:
 *       type: object
 *       properties:
 *         id_historial:
 *           type: integer
 *           description: ID único del registro de historial
 *           example: 1
 *         id_envio:
 *           type: integer
 *           description: ID del envío relacionado
 *           example: 1
 *         id_estado:
 *           type: integer
 *           description: ID del estado registrado
 *           example: 2
 *         fecha_cambio:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del cambio de estado
 *           example: "2025-01-10T10:30:00.000Z"
 * 
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para manejo de sesiones de usuario
 *   - name: Clientes
 *     description: Gestión de clientes del sistema
 *   - name: Envíos
 *     description: Gestión de envíos y paquetes
 *   - name: Casetas
 *     description: Gestión de casetas de control
 *   - name: Historial
 *     description: Historial de cambios de estado de envíos
 */

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Servidor corriendo en http://localhost:${PORT});
  console.log(Documentación Swagger disponible en: http://localhost:${PORT}/api-docs);
});