const express = require('express');
const router = express.Router();
const suporteController = require('../controllers/suporteController');
const { autenticar, autorizarAdmin } = require('../middleware/auth');

// Listar todas as mensagens de suporte (admin)
router.get('/suporte', autenticar, autorizarAdmin, suporteController.listarMensagensSuporte);

// Responder mensagem de suporte (admin)
router.put('/suporte/:id/responder', autenticar, autorizarAdmin, suporteController.responderMensagemSuporte);

module.exports = router;
