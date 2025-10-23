const Usuario = require("../models/Usuario");
const Doacao = require("../models/Doacao");

exports.gerarRelatorio = async (req, res) => {
  try {
    const { periodo } = req.query; // "7dias", "30dias", "6meses", "todos"

    const agora = new Date();
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

    // Totais
    const totalUsuarios = await Usuario.countDocuments();
    const usuariosBloqueados = await Usuario.countDocuments({ bloqueado: true });
    const usuariosAtivos = await Usuario.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } });
    const usuariosAdmin = await Usuario.countDocuments({ tipo: "admin" });
    const usuariosComum = await Usuario.countDocuments({ tipo: "comum", bloqueado: false });
    const totalDoacoes = await Doacao.countDocuments(filtroTempo);

    // Crescimento mensal para gráficos
    const mesesLabels = [];
    const usuariosPorMes = [];
    const doacoesPorMes = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = data.getMonth();
      const ano = data.getFullYear();
      mesesLabels.push(`${mes + 1}/${ano}`);

      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes + 1, 1);

      const usuariosMes = await Usuario.countDocuments({ createdAt: { $gte: inicioMes, $lt: fimMes } });
      const doacoesMes = await Doacao.countDocuments({ createdAt: { $gte: inicioMes, $lt: fimMes } });

      usuariosPorMes.push(usuariosMes);
      doacoesPorMes.push(doacoesMes);
    }

    const crescimentoUsuarios = usuariosPorMes[usuariosPorMes.length - 1] - usuariosPorMes[usuariosPorMes.length - 2];
    const crescimentoUsuariosPercent = ((crescimentoUsuarios / (usuariosPorMes[usuariosPorMes.length - 2] || 1)) * 100).toFixed(1);

    // Faixa etária
    const agoraAno = new Date().getFullYear();
    const faixaEtaria = {
      labels: ["<18","18-25","26-35","36-50",">50"],
      valores: [0, 0, 0, 0, 0]
    };

    const usuarios = await Usuario.find({}, "dataNascimento"); // pega apenas a data de nascimento
    usuarios.forEach(u => {
      if (!u.dataNascimento) return;
      const idade = agoraAno - u.dataNascimento.getFullYear();
      if (idade < 18) faixaEtaria.valores[0]++;
      else if (idade <= 25) faixaEtaria.valores[1]++;
      else if (idade <= 35) faixaEtaria.valores[2]++;
      else if (idade <= 50) faixaEtaria.valores[3]++;
      else faixaEtaria.valores[4]++;
    });

    const relatorio = {
      totalUsuarios,
      usuariosAtivos,
      usuariosBloqueados,
      usuariosAdmin,
      usuariosComum,
      totalDoacoes,
      meses: mesesLabels,
      usuariosPorMes,
      doacoesPorMes,
      crescimentoUsuarios: crescimentoUsuariosPercent,
      faixaEtaria, 
    };

    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ message: error.message });
  }
};
