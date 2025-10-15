const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ReportSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  doacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Doacao', required: true },
  messages: [MessageSchema],
  blocked: { type: Boolean, default: false },
  blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  reports: [ReportSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
