const Usuario = require("../models/Usuario");
const Doacao = require("../models/Doacao");
const Denuncia = require("../models/Denuncia"); // certifique-se de ter esse model

exports.gerarRelatorio = async (req, res) => {
  try {
    const { periodo } = req.query; // "todos", "semana" ou "mes"

    // Calcular intervalo de tempo
    let filtroTempo = {};
    if (periodo === "semana") {
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
      filtroTempo = { createdAt: { $gte: umaSemanaAtras } };
    } else if (periodo === "mes") {
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      filtroTempo = { createdAt: { $gte: umMesAtras } };
    }

    // Quantidades
    const totalUsuarios = await Usuario.countDocuments();
    const totalDoacoes = await Doacao.countDocuments(filtroTempo);
    const totalDoacoesExcluidas = await Doacao.countDocuments({ status: "excluida" });
    const totalDenuncias = await Denuncia.countDocuments(filtroTempo);

    // Categorias mais usadas
    const categorias = await Doacao.aggregate([
      { $match: filtroTempo },
      { $group: { _id: "$tipoMaterial", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const relatorio = {
      totalUsuarios,
      totalDoacoes,
      totalDoacoesExcluidas,
      totalDenuncias,
      categorias,
      periodo: periodo || "todos",
      geradoEm: new Date(),
    };

    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ message: error.message });
  }
};
