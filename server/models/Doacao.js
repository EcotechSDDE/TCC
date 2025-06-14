const mongoose = require('mongoose');

const DoacaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    modelo: String,
    marca: String,
    descricao: String,
    especificacao: String,
    potencia: String,
    tamanho: String,
    fotos: [String], // array de nomes de arquivos
    observacao: String,
    tipo: String,
    tipoMaterial: String,
    status: String,
    cor: String,
    endereco: String
});

module.exports = mongoose.model('Doacao', DoacaoSchema);