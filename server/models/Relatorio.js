const mongoose = require('mongoose');

const RelatorioSchema = new mongoose.Schema({
    tipo: { type: String, required: true }, // ex: doacoes, usuarios, categorias
    dados: { type: mongoose.Schema.Types.Mixed },
    geradoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Relatorio', RelatorioSchema);
