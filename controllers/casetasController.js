const casetaModel = require("../models/casetaModel");

const getAllCasetas = async (req, res) => {
  try {
    const casetas = await casetaModel.getCasetas();
    res.json(casetas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCasetaById = async (req, res) => {
  try {
    const caseta = await casetaModel.getCasetaById(req.params.id);
    if (!caseta) return res.status(404).json({ error: "Caseta no encontrada" });
    res.json(caseta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCasetas,
  getCasetaById,
};
