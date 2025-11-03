const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "seusegredoaqui";

// 🔹 Criar novo usuário
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, telefone, cpfCnpj, password, tipo, dataNascimento } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const novoUsuario = new Usuario({
      nome,
      email,
      telefone,
      cpfCnpj,
      senha: senhaHash,
      tipo,
      dataNascimento,
      imagem: req.file ? req.file.filename : null,
    });

    await novoUsuario.save();
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    // Verifica bloqueio temporário
    if (usuario.bloqueado) {
      const agora = new Date();
      if (usuario.dataDesbloqueio && usuario.dataDesbloqueio <= agora) {
        // Desbloqueia automaticamente
        usuario.bloqueado = false;
        usuario.motivoBloqueio = null;
        usuario.dataDesbloqueio = null;
        await usuario.save();
      } else {
        return res.status(403).json({
          message: usuario.motivoBloqueio
            ? `Usuário bloqueado: ${usuario.motivoBloqueio}`
            : "Usuário bloqueado",
        });
      }
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha);
    if (!senhaValida) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        imagem: usuario.imagem,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno ao efetuar login" });
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

// 🔹 Buscar usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senha");
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Atualizar usuário (pelo próprio usuário)
exports.atualizarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, email, telefone, cpfCnpj, password, dataNascimento } = req.body;

    const updateData = { nome, email, telefone, cpfCnpj, dataNascimento };
    if (password) updateData.senha = await bcrypt.hash(password, 10);
    if (req.file) updateData.imagem = req.file.filename;

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, updateData, { new: true });
    if (!usuarioAtualizado) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Editar usuário (admin)
exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cpfCnpj, tipo, password, dataNascimento } = req.body;

    const updateData = { nome, email, telefone, cpfCnpj, tipo, dataNascimento };
    if (password) updateData.senha = await bcrypt.hash(password, 10);
    if (req.file) updateData.imagem = req.file.filename;

    const usuario = await Usuario.findByIdAndUpdate(id, updateData, { new: true });
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Listar todos os usuários (admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Bloquear usuário permanentemente
exports.bloquearUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { bloqueado: true, motivoBloqueio: motivo || "Bloqueio administrativo", dataDesbloqueio: null },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário bloqueado com sucesso", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Bloquear usuário temporariamente
exports.bloquearPorTempo = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, tempo } = req.body;

    const dataDesbloqueio = new Date(Date.now() + tempo * 24 * 60 * 60 * 1000);

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { bloqueado: true, motivoBloqueio: motivo || "Bloqueio temporário", dataDesbloqueio },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário bloqueado temporariamente", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Desbloquear usuário
exports.desbloquearUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { bloqueado: false, motivoBloqueio: null, dataDesbloqueio: null },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário desbloqueado com sucesso", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tornar usuário admin
exports.atribuirAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { tipo: "admin" },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário agora é administrador", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Deletar usuário
exports.deletarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
