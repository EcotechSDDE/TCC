const mongoose = require('mongoose');

const DoacaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    modelo: String,
    marca: String,
    descricao: String,
    especificacao: String,
    potencia: String,
    tamanho: String,
    fotos: [String],
    observacao: String,
    tipo: String,
    tipoMaterial: String,
    status: String,
    cor: String,
    endereco: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Doacao', DoacaoSchema);