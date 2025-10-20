const mongoose = require('mongoose');

const SuporteSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    mensagem: { type: String, required: true },
    resposta: { type: String },
    status: { type: String, enum: ['pendente', 'respondida'], default: 'pendente' },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suporte', SuporteSchema);
