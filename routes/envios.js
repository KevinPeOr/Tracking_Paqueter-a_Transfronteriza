const express = require("express");
const router = express.Router();
const enviosController = require("../controllers/enviosController");
const historialController = require("../controllers/historialController");

router.get("/", enviosController.getEnvio);
router.get("/:envios", enviosController.getAllEnvio);

module.exports = router;
