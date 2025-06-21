const Doacao = require("../models/Doacao");

// Criar nova doação
exports.criarDoacao = async (req, res) => {
    const {
        nome, modelo, marca, descricao, especificacao, potencia, tamanho,
        observacao, tipo, tipoMaterial, status, cor, endereco
    } = req.body;
    const fotos = req.files ? req.files.map(file => file.filename) : [];

    const novaDoacao = new Doacao({
        nome, modelo, marca, descricao, especificacao, potencia, tamanho,
        fotos, observacao, tipo, tipoMaterial, status, cor, endereco
    });

    try {
        const savedDoacao = await novaDoacao.save();
        res.status(201).json(savedDoacao);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todas as doações
exports.listarDoacoes = async (req, res) => {
    try {
        const doacoes = await Doacao.find();
        res.status(200).json(doacoes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};