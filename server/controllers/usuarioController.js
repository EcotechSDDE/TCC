const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "seusegredoaqui";

// Criar novo usuário
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
      dataNascimento: new Date(dataNascimento),
      imagem,
      senha: senhaHash,
      tipo: tipo || "comum",
    });

    const savedUser = await novoUsuario.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Listar todos os usuários (sem senha)
exports.listarUsuarios = async (req, res) => {
  try {
    const users = await Usuario.find().select("-senha");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuário por ID ou token
exports.buscarUsuarioPorId = async (req, res) => {
  try {
    const id = req.usuario?.id || req.params.id;
    if (!id) return res.status(400).json({ message: "ID do usuário não fornecido" });

    const user = await Usuario.findById(id).select("-senha");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuário logado
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

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(401).json({ message: "Usuário não encontrado" });

    // Bloqueio de conta
    if (usuario.bloqueado) {
      // Se bloqueio temporário
      if (usuario.bloqueadoUntil) {
        if (usuario.bloqueadoUntil > Date.now()) {
          return res.status(403).json({
            message: `Usuário bloqueado até ${usuario.bloqueadoUntil}`,
          });
        } else {
          // Bloqueio temporário expirou
          usuario.bloqueado = false;
          usuario.bloqueadoUntil = null;
          await usuario.save();
        }
      } else {
        // Bloqueio permanente
        return res.status(403).json({ message: "Usuário bloqueado" });
      }
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha);
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
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};

// Atualizar usuário
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

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar usuário (admin)
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

// Bloquear/desbloquear usuário (admin)
exports.bloquearUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    if (usuario.bloqueado) {
      // Desbloqueando
      usuario.bloqueado = false;
      usuario.bloqueadoUntil = null;
    } else {
      // Bloqueando
      usuario.bloqueado = true;
      usuario.bloqueadoUntil = null;
    }

    await usuario.save();

    res.status(200).json({
      bloqueado: usuario.bloqueado,
      message: usuario.bloqueado
        ? "Usuário bloqueado com sucesso"
        : "Usuário desbloqueado com sucesso",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bloquear usuário por tempo (admin)
exports.bloquearPorTempo = async (req, res) => {
  try {
    const { duracaoHoras } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    usuario.bloqueado = true;
    usuario.bloqueadoUntil = duracaoHoras
      ? new Date(Date.now() + duracaoHoras * 3600 * 1000)
      : null;

    await usuario.save();

    res.status(200).json({
      bloqueado: usuario.bloqueado,
      bloqueadoUntil: usuario.bloqueadoUntil,
      message: "Usuário bloqueado temporariamente",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Atribuir/remover admin
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
