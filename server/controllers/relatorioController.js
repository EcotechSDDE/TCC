const Relatorio = require('../models/Relatorio');
const Usuario = require('../models/Usuario');
const Doacao = require('../models/Doacao');

exports.gerarRelatorio = async (req, res) => {
    try {
        const totalUsuarios = await Usuario.countDocuments();
        const totalDoacoes = await Doacao.countDocuments();
        // Exemplo: categorias mais usadas
        const categorias = await Doacao.aggregate([
            { $group: { _id: '$tipoMaterial', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        const relatorio = {
            totalUsuarios,
            totalDoacoes,
            categorias
        };
        res.status(200).json(relatorio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
