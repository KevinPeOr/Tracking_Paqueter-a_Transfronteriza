require("dotenv").config({ debug: true });
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Import routes
const clientesRoutes = require("./routes/clientes");
const enviosRoutes = require("./routes/envios");
const casetaRoutes = require("./routes/caseta");
const historialRoutes = require("./routes/historial");
// Routes - fixed the path syntax (missing forward slash)
app.use("/api/clientes", clientesRoutes);
app.use("/api/envios", enviosRoutes);
app.use("/api/casetas", casetaRoutes);
app.use("/api/historial", historialRoutes);
// Root route
app.get("/", (req, res) => {
  res.send("API TRACKING-PAQUETES funcionando con módulo de clientes 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
