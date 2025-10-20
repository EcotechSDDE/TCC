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

// Rota protegida para usuários autenticados
userRoutes.get('/user/me', autenticar, usuarioController.buscarUsuarioLogado);

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
userRoutes.post("/update/:id", upload.single('imagem'), usuarioController.atualizarUsuario);

// DELETE - Remover usuário por ID
userRoutes.delete("/:id", usuarioController.deletarUsuario);

// POST - Login
userRoutes.post("/login", usuarioController.login);

// Rota protegida para admins
userRoutes.get('/admin/usuarios', autenticar, autorizarAdmin, usuarioController.listarUsuarios);

// Rotas ADMIN - Gerenciar usuários
userRoutes.put('/user/:id', autenticar, autorizarAdmin, usuarioController.editarUsuario); // Editar usuário
userRoutes.put('/user/:id/bloquear', autenticar, autorizarAdmin, usuarioController.bloquearUsuario); // Bloquear/desbloquear usuário
userRoutes.delete('/user/:id', autenticar, autorizarAdmin, usuarioController.excluirUsuario); // Excluir usuário
userRoutes.put('/user/:id/admin', autenticar, autorizarAdmin, usuarioController.atribuirAdmin); // Atribuir/remover admin

module.exports = userRoutes;
