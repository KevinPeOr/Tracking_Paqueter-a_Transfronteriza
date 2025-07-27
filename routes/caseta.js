const express = require("express");
const router = express.Router();
const casetaModel = require("../models/casetaModel");

// GET todas las casetas
router.get("/", async (req, res) => {
  try {
    const casetas = await casetaModel.getCasetas();
    res.json(casetas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET una caseta por ID
router.get("/:id", async (req, res) => {
  try {
    const caseta = await casetaModel.getCasetaById(req.params.id);
    if (!caseta) return res.status(404).json({ error: "Caseta no encontrada" });
    res.json(caseta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
