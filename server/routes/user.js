const express = require("express");
const userRoutes = express.Router();
const usuarioController = require("../controllers/usuarioController");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require('express-validator');
const { autenticar, autorizarAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ ROTAS SEM DUPLICAÇÃO DO PREFIXO
userRoutes.get('/me', autenticar, usuarioController.buscarUsuarioLogado); // /user/me
userRoutes.post("/login", usuarioController.login);                         // /user/login
userRoutes.post("/add", upload.single('imagem'), usuarioController.criarUsuario); // /user/add

// Outras rotas mantidas, mas sem repetir /user no caminho
userRoutes.get("/", usuarioController.listarUsuarios); // /user/
userRoutes.get("/:id", usuarioController.buscarUsuarioPorId); // /user/:id
userRoutes.post("/update/:id", upload.single('imagem'), usuarioController.atualizarUsuario);
userRoutes.delete("/:id", usuarioController.deletarUsuario);

// Admin
userRoutes.get('/admin/usuarios', autenticar, autorizarAdmin, usuarioController.listarUsuarios);
userRoutes.put('/:id', autenticar, autorizarAdmin, usuarioController.editarUsuario);
userRoutes.put('/:id/bloquear', autenticar, autorizarAdmin, usuarioController.bloquearUsuario);
userRoutes.delete('/:id', autenticar, autorizarAdmin, usuarioController.excluirUsuario);
userRoutes.put('/:id/admin', autenticar, autorizarAdmin, usuarioController.atribuirAdmin);

module.exports = userRoutes;
