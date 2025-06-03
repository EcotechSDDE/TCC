const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    cpfCnpj: { type: String, required: true, unique: true },
    imagem: { type: String }, // Caminho ou URL da imagem
    senha: { type: String } // Caso queira adicionar autenticação depois
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema);