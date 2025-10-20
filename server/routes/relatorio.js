const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { autenticar, autorizarAdmin } = require('../middleware/auth');

// Gerar relatório e estatísticas (admin)
router.get('/relatorio', autenticar, autorizarAdmin, relatorioController.gerarRelatorio);

module.exports = router;
