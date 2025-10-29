const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    cpfCnpj: { type: String, required: true, unique: true },
    imagem: { type: String },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ['admin', 'comum'], default: 'comum' },
    bloqueado: { type: Boolean, default: false },
    bloqueadoUntil: { type: Date, default: null },
    motivoBloqueio: { type: String, default: null } 
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);