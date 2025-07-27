const envioModel = require("../models/envioModel");

const getEnvio = async (req, res) => {
  try {
    const envios = await envioModel.getAllEnvio();
    res.json(envios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllEnvio = async (req, res) => {
  try {
    const envios = await envioModel.getEnvioById(req.params.id);
    if (!envios)
      return res.status(404).json({ message: "envios no encontrado" });
    res.json(envios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEnvio,
  getEnvio,
};
