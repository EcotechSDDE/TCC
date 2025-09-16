const express = require("express");
const userRoutes = express.Router();
const usuarioController = require("../controllers/usuarioController");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require('express-validator');
const { autenticar, autorizarAdmin } = require('../middleware/auth');

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

// GET todos os usuários
userRoutes.get("/user", usuarioController.listarUsuarios);

// GET usuário por ID
userRoutes.get("/user/:id", usuarioController.buscarUsuarioPorId);

// POST - Criar novo usuário
userRoutes.post("/user/add", upload.single('imagem'), [
    body('email').isEmail(),
    body('telefone').isLength({ min: 14 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioController.criarUsuario);

// POST - Atualizar usuário por ID
userRoutes.post("/update/:id", usuarioController.atualizarUsuario);

// DELETE - Remover usuário por ID
userRoutes.delete("/:id", usuarioController.deletarUsuario);

// POST - Login
userRoutes.post("/login", usuarioController.login);

// Rota protegida para admins
userRoutes.get('/admin/usuarios', autenticar, autorizarAdmin, usuarioController.listarUsuarios);

// Rota protegida para usuários autenticados
userRoutes.get('/user/me', autenticar, usuarioController.buscarUsuarioPorId);

module.exports = userRoutes;
