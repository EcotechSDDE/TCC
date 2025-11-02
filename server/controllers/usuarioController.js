const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "seusegredoaqui";

// 🔹 Criar novo usuário
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, telefone, cpfCnpj, senha, tipo, dataNascimento } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const imagem = req.file ? req.file.filename : null;

    const novoUsuario = new Usuario({
      nome,
      email,
      telefone,
      cpfCnpj,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
      imagem,
      senha: senhaHash,
      tipo: tipo || "comum",
    });

    const savedUser = await novoUsuario.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, tipo: savedUser.tipo },
      SECRET,
      { expiresIn: "30m" } 
    );

    res.status(201).json({
      token,
      usuario: {
        id: savedUser._id,
        nome: savedUser.nome,
        tipo: savedUser.tipo,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(401).json({ message: "Usuário não encontrado" });

    // Verifica bloqueio
    if (usuario.bloqueado) {
      if (usuario.bloqueadoUntil && usuario.bloqueadoUntil > Date.now()) {
        return res.status(403).json({
          bloqueado: true,
          motivoBloqueio: usuario.motivoBloqueio || "Não informado",
          bloqueadoUntil: usuario.bloqueadoUntil,
          message: `Usuário bloqueado até ${usuario.bloqueadoUntil}`,
        });
      } else if (!usuario.bloqueadoUntil) {
        return res.status(403).json({
          bloqueado: true,
          motivoBloqueio: usuario.motivoBloqueio || "Não informado",
          message: "Usuário bloqueado permanentemente",
        });
      } else {
        // desbloqueia automaticamente se expirou
        usuario.bloqueado = false;
        usuario.bloqueadoUntil = null;
        usuario.motivoBloqueio = null;
        await usuario.save();
      }
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      return res.status(401).json({ message: "Senha inválida" });

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, tipo: usuario.tipo },
      SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        tipo: usuario.tipo,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};

// 🔹 Buscar usuário logado
exports.buscarUsuarioLogado = async (req, res) => {
  try {
    const id = req.usuario?._id || req.usuario?.id;
    if (!id) return res.status(400).json({ message: "ID do usuário não fornecido" });

    const user = await Usuario.findById(id).select("-senha");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Listar todos os usuários (admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const users = await Usuario.find().select("-senha");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Atualizar usuário (usuario logado)
exports.atualizarUsuario = async (req, res) => {
  try {
    const update = {};
    if (req.body.nome) update.nome = req.body.nome;
    if (req.body.email) update.email = req.body.email;
    if (req.body.telefone) update.telefone = req.body.telefone;
    if (req.body.senha) update.senha = await bcrypt.hash(req.body.senha, 10);
    if (req.file) update.imagem = req.file.filename;

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Deletar usuário (admin)
exports.deletarUsuario = async (req, res) => {
  try {
    const userId = req.params.id;
    const Doacao = require("../models/Doacao");
    await Doacao.deleteMany({ usuario: userId });

    const usuario = await Usuario.findByIdAndDelete(userId);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário e todas as suas doações foram deletados com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Editar usuário (admin)
exports.editarUsuario = async (req, res) => {
  try {
    const update = {};
    if (req.body.nome) update.nome = req.body.nome;
    if (req.body.email) update.email = req.body.email;
    if (req.body.telefone) update.telefone = req.body.telefone;
    if (req.body.tipo) update.tipo = req.body.tipo;
    if (req.body.senha) update.senha = await bcrypt.hash(req.body.senha, 10);
    if (req.file) update.imagem = req.file.filename;
    if (req.body.bloqueado !== undefined) update.bloqueado = req.body.bloqueado;

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Bloquear/desbloquear usuário (admin)
exports.bloquearUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    usuario.bloqueado = !usuario.bloqueado;
    usuario.bloqueadoUntil = usuario.bloqueado ? null : usuario.bloqueadoUntil;
    usuario.motivoBloqueio = usuario.bloqueado ? req.body?.motivo || "Não informado" : null;

    await usuario.save();

    res.status(200).json({
      bloqueado: usuario.bloqueado,
      message: usuario.bloqueado ? "Usuário bloqueado" : "Usuário desbloqueado",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Bloquear usuário por tempo (admin)
exports.bloquearPorTempo = async (req, res) => {
  try {
    const { duracao, unidade, motivo } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    let duracaoHoras = null;
    if (unidade && duracao && !isNaN(duracao)) {
      const dur = Number(duracao);
      switch (unidade) {
        case "segundos": duracaoHoras = dur / 3600; break;
        case "minutos": duracaoHoras = dur / 60; break;
        case "horas": duracaoHoras = dur; break;
        case "dias": duracaoHoras = dur * 24; break;
      }
    }

    usuario.bloqueado = true;
    usuario.bloqueadoUntil = duracaoHoras ? new Date(Date.now() + duracaoHoras * 3600 * 1000) : null;
    usuario.motivoBloqueio = motivo?.trim() || "Não informado";

    await usuario.save();

    res.status(200).json({
      bloqueado: usuario.bloqueado,
      bloqueadoUntil: usuario.bloqueadoUntil,
      motivoBloqueio: usuario.motivoBloqueio,
      message: usuario.bloqueadoUntil
        ? `Usuário bloqueado até ${usuario.bloqueadoUntil.toLocaleString("pt-BR")}`
        : "Usuário bloqueado permanentemente",
    });
  } catch (error) {
    console.error("Erro ao bloquear usuário:", error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Atribuir/remover admin
exports.atribuirAdmin = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    usuario.tipo = usuario.tipo === "admin" ? "comum" : "admin";
    await usuario.save();

    res.status(200).json({ tipo: usuario.tipo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
