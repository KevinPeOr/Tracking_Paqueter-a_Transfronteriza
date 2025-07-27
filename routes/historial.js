const express = require("express");
const router = express.Router();
const historialModel = require("../models/historialModel");

router.get("/:id_envio", async (req, res) => {
  try {
    const historial = await historialModel.getHistorialByEnvioId(
      req.params.id_envio
    );
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
