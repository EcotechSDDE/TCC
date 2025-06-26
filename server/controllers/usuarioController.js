const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

// Criar novo usuário
exports.criarUsuario = async (req, res) => {
    const { nome, email, telefone, cpfCnpj, senha } = req.body;
    const senhaHash = await bcrypt.hash(req.body.senha, 10); // serve para criptografar a senha
    const dataNascimento = new Date(req.body.dataNascimento);
    const imagem = req.file ? req.file.filename : null;

    const novoUsuario = new Usuario({
      nome,
      email,
      telefone,
      dataNascimento,
      cpfCnpj,
      imagem,
      senha: senhaHash, // serve para armazenar a senha criptografada
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

// Buscar usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usuario.findOne({ email });
        if (user && await bcrypt.compare(password, user.senha)) {
            res.status(200).json({ success: true, message: "Login realizado com sucesso!", user });
        } else {
            res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Atualizar usuário por ID
exports.atualizarUsuario = async (req, res) => {
    try {
        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                user: req.body.user,
                email: req.body.email,
                function: req.body.function
            },
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