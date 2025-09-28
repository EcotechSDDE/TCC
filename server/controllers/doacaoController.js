const Doacao = require("../models/Doacao");

// Criar nova doação
exports.criarDoacao = async (req, res) => {
    const {
        nome, modelo, marca, descricao, especificacao, potencia, tamanho,
        observacao, tipo, tipoMaterial, status, cor, endereco
    } = req.body;
    const fotos = req.files ? req.files.map(file => file.filename) : [];

    const dadosDaDoacao = {
        nome, modelo, marca, descricao, especificacao, potencia, tamanho,
        fotos, observacao, tipo, tipoMaterial, status, cor, endereco
    };

    // Supondo que req.userId vem do middleware de autenticação
    const novaDoacao = new Doacao({
        ...dadosDaDoacao,
        usuario: req.userId
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
        const doacoes = await Doacao.find().populate('usuario');
        res.status(200).json(doacoes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar doação por ID
exports.deletarDoacao = async (req, res) => {
    try {
        const doacao = await Doacao.findById(req.params.id);
        if (!doacao) return res.status(404).json({ message: "Doação não encontrada" });
        // Só permite deletar se o usuário for o dono
        if (doacao.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: "Você não tem permissão para deletar esta doação" });
        }
        await Doacao.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Doação deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};