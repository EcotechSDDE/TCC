const express = require("express");
const userRoutes = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { autenticar, autorizarAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🔹 Rotas públicas
userRoutes.post("/login", usuarioController.login);
userRoutes.post("/add", upload.single("imagem"), usuarioController.criarUsuario);

// 🔹 Rotas do usuário autenticado
userRoutes.get("/me", autenticar, usuarioController.buscarUsuarioLogado);
userRoutes.get("/:id", autenticar, usuarioController.buscarUsuarioPorId);
userRoutes.post("/update/:id", autenticar, upload.single("imagem"), usuarioController.atualizarUsuario);
userRoutes.delete("/:id", autenticar, usuarioController.deletarUsuario);

// 🔹 Rotas de administrador
userRoutes.get("/", autenticar, autorizarAdmin, usuarioController.listarUsuarios);
userRoutes.put("/:id", autenticar, autorizarAdmin, upload.single("imagem"), usuarioController.editarUsuario);
userRoutes.put("/:id/bloquear", autenticar, autorizarAdmin, usuarioController.bloquearUsuario);
userRoutes.put("/:id/tempo", autenticar, autorizarAdmin, usuarioController.bloquearPorTempo);
userRoutes.put("/:id/admin", autenticar, autorizarAdmin, usuarioController.atribuirAdmin);
userRoutes.delete("/:id/admin", autenticar, autorizarAdmin, usuarioController.deletarUsuario);

module.exports = userRoutes;
