const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { autenticar, autorizarAdmin } = require('../middleware/auth');

// Criar ou obter chat entre dois usuários
router.post('/chat', autenticar, chatController.createOrGetChat);
// Listar chats do usuário
router.get('/chat', autenticar, chatController.listChats);
// Obter chat por id
router.get('/chat/:id', autenticar, chatController.getChat);
// Enviar mensagem
router.post('/chat/:id/message', autenticar, chatController.sendMessage);
// Denunciar mensagem
router.post('/chat/:id/report', autenticar, chatController.reportMessage);
// Obter chat único por doação
router.get('/chat/by-donation/:doacaoId', autenticar, chatController.getChatByDonation);
// Admin bloqueia/desbloqueia chat
router.post('/chat/:id/block', autenticar, autorizarAdmin, chatController.blockChat);
router.post('/chat/:id/unblock', autenticar, autorizarAdmin, chatController.unblockChat);

module.exports = router;
