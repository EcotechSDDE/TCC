const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const { autenticar, autorizarAdmin } = require("../middleware/auth");

router.get("/", autenticar, autorizarAdmin, relatorioController.gerarRelatorio);

module.exports = router;
