const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'seusegredoaqui';

// Criar novo usuário
exports.criarUsuario = async (req, res) => {
    const { nome, email, telefone, cpfCnpj, senha, tipo } = req.body;
    const senhaHash = await bcrypt.hash(req.body.senha, 10); // serve para criptografar a senha
    const dataNascimento = new Date(req.body.dataNascimento);
    const imagem = req.file ? req.file.filename : null;

    // Se tipo não for fornecido, será 'comum' por padrão
    const novoUsuario = new Usuario({
      nome,
      email,
      telefone,
      dataNascimento,
      cpfCnpj,
      imagem,
      senha: senhaHash, // serve para armazenar a senha criptografada
      tipo: tipo || 'comum'
    });

    try {
        const savedUser = await novoUsuario.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const users = await Usuario.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar usuário por ID ou pelo token JWT
exports.buscarUsuarioPorId = async (req, res) => {
    try {
        // Se vier da rota /user/me, use o id do token
        const id = req.usuario?.id || req.params.id;
        if (!id) return res.status(400).json({ message: "ID do usuário não fornecido" });
        const user = await Usuario.findById(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar usuário autenticado pelo token JWT
exports.buscarUsuarioLogado = async (req, res) => {
  try {
    const id = req.usuario?._id || req.usuario?.id;
    if (!id) return res.status(400).json({ message: "ID do usuário não fornecido" });

    const user = await Usuario.findById(id);
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
        if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(password, usuario.senha);
        if (!senhaValida) return res.status(401).json({ message: 'Senha inválida' });

        // Gera token JWT com _id, email e tipo do usuário
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, tipo: usuario.tipo },
            SECRET,
            { expiresIn: '30m' }
        );

        // Retorna token e informações básicas do usuário
        res.status(200).json({ 
            token, 
            usuario: { 
                id: usuario._id, 
                nome: usuario.nome, 
                tipo: usuario.tipo,
                email: usuario.email
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};

// Atualizar usuário por ID
exports.atualizarUsuario = async (req, res) => {
    try {
        const update = {};
        if (req.body.nome) update.nome = req.body.nome;
        if (req.body.email) update.email = req.body.email;
        if (req.body.telefone) update.telefone = req.body.telefone;
        if (req.body.senha) update.senha = await bcrypt.hash(req.body.senha, 10);
        if (req.file) update.imagem = req.file.filename;
        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar usuário por ID
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
        if (req.body.senha) update.senha = await bcrypt.hash(req.body.senha, 10);
        if (req.body.tipo) update.tipo = req.body.tipo;
        if (req.body.bloqueado !== undefined) update.bloqueado = req.body.bloqueado;
        if (req.file) update.imagem = req.file.filename;
        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Bloquear/desbloquear usuário (admin)
exports.bloquearUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
        usuario.bloqueado = !usuario.bloqueado;
        await usuario.save();
        res.status(200).json({ bloqueado: usuario.bloqueado });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Excluir usuário (admin)
exports.excluirUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Atribuir/remover admin (admin)
exports.atribuirAdmin = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
        usuario.tipo = usuario.tipo === 'admin' ? 'comum' : 'admin';
        await usuario.save();
        res.status(200).json({ tipo: usuario.tipo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};