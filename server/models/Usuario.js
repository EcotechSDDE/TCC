const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    cpfCnpj: { type: String, required: true, unique: true },
    imagem: { type: String }, // Caminho ou URL da imagem
    senha: { type: String, required: true }, // Senha do usuário
    tipo: { type: String, enum: ['admin', 'comum'], default: 'comum' }, // Tipo de usuário (admin ou comum)
    bloqueado: { type: Boolean, default: false } // Usuário bloqueado

});

module.exports = mongoose.model('Usuario', UsuarioSchema);