const express = require("express");
const userRoutes = express.Router();
const Usuario = require("../models/Usuario");
const multer = require("multer");
const path = require("path");

// Configuração do multer para salvar imagens na pasta /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 🔹 GET todos os usuários
userRoutes.get("/user", async (req, res) => {
  try {
    const users = await Usuario.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 GET usuário por ID
userRoutes.get("/user/:id", async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 POST - Criar novo usuário
userRoutes.post("/user/add", upload.single('imagem'), async (req, res) => {
  const { nome, email, telefone, cpfCnpj, senha } = req.body;
  const dataNascimento = new Date(req.body.dataNascimento);
  const imagem = req.file ? req.file.filename : null; // Só o nome do arquivo
  const novoUsuario = new Usuario({ nome, email, telefone, dataNascimento, cpfCnpj, imagem, senha });

  try {
    const savedUser = await novoUsuario.save();
    console.log("Usuário criado");
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 POST - Atualizar usuário por ID
userRoutes.post("/update/:id", async (req, res) => {
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

    console.log("Usuário atualizado");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 DELETE - Remover usuário por ID
userRoutes.delete("/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    console.log("Usuário deletado");
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 POST - Login
userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email});
    if (user && user.senha === password) {
      res.status(200).json({ success: true, message: "Login realizado com sucesso!", user });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = userRoutes;
