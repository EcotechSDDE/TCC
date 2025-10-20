const mongoose = require('mongoose');

const DenunciaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    doacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Doacao' },
    motivo: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'resolvida'], default: 'pendente' },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Denuncia', DenunciaSchema);
