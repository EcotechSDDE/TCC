const Usuario = require("../models/Usuario");
const Doacao = require("../models/Doacao");
const Denuncia = require("../models/Denuncia"); 

exports.gerarRelatorio = async (req, res) => {
  try {
    const { periodo } = req.query;
    const agora = new Date();

    // 🔹 Filtro por período
    let filtroTempo = {};
    if (periodo === "7dias") {
      const inicio = new Date();
      inicio.setDate(agora.getDate() - 7);
      filtroTempo = { createdAt: { $gte: inicio } };
    } else if (periodo === "30dias") {
      const inicio = new Date();
      inicio.setDate(agora.getDate() - 30);
      filtroTempo = { createdAt: { $gte: inicio } };
    } else if (periodo === "6meses") {
      const inicio = new Date();
      inicio.setMonth(agora.getMonth() - 6);
      filtroTempo = { createdAt: { $gte: inicio } };
    }

    // 🔹 Totais gerais
    const totalUsuarios = await Usuario.countDocuments();
    const usuariosBloqueados = await Usuario.countDocuments({ bloqueado: true });
    const usuariosAdmin = await Usuario.countDocuments({ tipo: "admin" });
    const usuariosComum = await Usuario.countDocuments({ tipo: "comum", bloqueado: false });
    const totalDoacoes = await Doacao.countDocuments(filtroTempo);

    // 🔹 Denúncias ativas (pendentes)
    const denunciasAtivas = await Denuncia.countDocuments({ status: "pendente" });

    // 🔹 Crescimento mensal (últimos 6 meses)
    const mesesLabels = [];
    const usuariosPorMes = [];
    const doacoesPorMes = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = data.getMonth();
      const ano = data.getFullYear();
      mesesLabels.push(`${("0" + (mes + 1)).slice(-2)}/${ano}`);

      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes + 1, 1);

      const usuariosMes = await Usuario.countDocuments({
        createdAt: { $gte: inicioMes, $lt: fimMes },
      });

      const doacoesMes = await Doacao.countDocuments({
        createdAt: { $gte: inicioMes, $lt: fimMes },
      });

      usuariosPorMes.push(usuariosMes);
      doacoesPorMes.push(doacoesMes);
    }

    // 🔹 Faixa etária
    const agoraAno = new Date().getFullYear();
    const faixaEtaria = {
      labels: ["<18", "18-25", "26-35", "36-50", ">50"],
      valores: [0, 0, 0, 0, 0],
    };

    const usuarios = await Usuario.find({}, "dataNascimento");
    usuarios.forEach((u) => {
      if (!u.dataNascimento) return;
      const idade = agoraAno - u.dataNascimento.getFullYear();
      if (idade < 18) faixaEtaria.valores[0]++;
      else if (idade <= 25) faixaEtaria.valores[1]++;
      else if (idade <= 35) faixaEtaria.valores[2]++;
      else if (idade <= 50) faixaEtaria.valores[3]++;
      else faixaEtaria.valores[4]++;
    });

    // 🔹 Monta o relatório final
    const relatorio = {
      totalUsuarios,
      usuariosBloqueados,
      usuariosAdmin,
      usuariosComum,
      totalDoacoes,
      denunciasAtivas, 
      meses: mesesLabels,
      usuariosPorMes,
      doacoesPorMes,
      faixaEtaria,
    };

    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ message: error.message });
  }
};
