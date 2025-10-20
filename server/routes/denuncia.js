const express = require('express');
const router = express.Router();
const { autenticar, autorizarAdmin } = require('../middleware/auth');
const denunciaController = require('../controllers/denunciaController');

// Usuário comum cria denúncia
router.post('/', autenticar, denunciaController.criarDenuncia);

// Admin vê todas as denúncias
router.get('/', autenticar, autorizarAdmin, denunciaController.listarDenuncias);

// Admin resolve denúncia
router.put('/:id/resolver', autenticar, autorizarAdmin, denunciaController.resolverDenuncia);

module.exports = router;
