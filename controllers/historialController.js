const historialModel = require("../models/historialModel");

const getHistorialByEnvioId = async (req, res) => {
  try {
    const historial = await historialModel.getHistorialByEnvioId(
      req.params.id_envio
    );
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHistorialByEnvioId,
};
