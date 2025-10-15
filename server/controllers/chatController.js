const Chat = require('../models/Chat');
const Usuario = require('../models/Usuario');

exports.createOrGetChat = async (req, res) => {
  try {
    const { otherUserId, doacaoId } = req.body;
    const userId = req.userId;
    // procurar chat existente entre os dois para a mesma doação
    let chat = await Chat.findOne({
      doacao: doacaoId,
      participants: { $all: [userId, otherUserId] }
    }).populate('participants messages.sender reports.reporter blockedBy');
    if (!chat) {
      chat = new Chat({ participants: [userId, otherUserId], doacao: doacaoId });
      await chat.save();
      chat = await Chat.findById(chat._id).populate('participants messages.sender reports.reporter blockedBy');
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.userId }).populate('participants messages.sender reports.reporter blockedBy');
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('participants messages.sender reports.reporter blockedBy');
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });
    if (chat.blocked) return res.status(403).json({ message: 'Chat bloqueado' });
    const message = { sender: req.userId, text: req.body.text };
    chat.messages.push(message);
    await chat.save();
    const populated = await Chat.findById(chat._id).populate('messages.sender');
    res.status(201).json(populated.messages[populated.messages.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reportMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });
    const { messageId, reason } = req.body;
    chat.reports.push({ messageId, reporter: req.userId, reason });
    await chat.save();
    // opcional: notificar admins (não implementado aqui)
    res.status(201).json({ message: 'Denúncia enviada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.blockChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });
    chat.blocked = true;
    chat.blockedBy = req.userId;
    await chat.save();
    res.status(200).json({ message: 'Chat bloqueado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unblockChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });
    chat.blocked = false;
    chat.blockedBy = null;
    await chat.save();
    res.status(200).json({ message: 'Chat desbloqueado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Busca chat único por doação
exports.getChatByDonation = async (req, res) => {
  try {
    const doacaoId = req.params.doacaoId;
    const userId = req.userId;
    // Busca chat que tenha este doacaoId e o usuário logado como participante
    let chat = await Chat.findOne({ doacao: doacaoId, participants: userId })
      .populate('participants messages.sender reports.reporter blockedBy');
    if (!chat) {
      // Busca dono da doação
      const Doacao = require('../models/Doacao');
      const doacao = await Doacao.findById(doacaoId);
      if (!doacao) return res.status(404).json({ message: 'Doação não encontrada' });
      // Cria chat se não existir
      const ownerId = doacao.usuario.toString();
      if (ownerId === userId) return res.status(400).json({ message: 'Você não pode conversar consigo mesmo.' });
      chat = new Chat({ participants: [userId, ownerId], doacao: doacaoId });
      await chat.save();
      chat = await Chat.findById(chat._id).populate('participants messages.sender reports.reporter blockedBy');
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
