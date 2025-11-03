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
userRoutes.put("/update/:id", autenticar, upload.single("imagem"), usuarioController.atualizarUsuario);
userRoutes.delete("/delete/:id", autenticar, usuarioController.deletarUsuario);

// 🔹 Rotas administrativas
userRoutes.get("/", autenticar, autorizarAdmin, usuarioController.listarUsuarios);
userRoutes.put("/edit/:id", autenticar, autorizarAdmin, upload.single("imagem"), usuarioController.editarUsuario);
userRoutes.put("/bloquear/:id", autenticar, autorizarAdmin, usuarioController.bloquearUsuario);
userRoutes.put("/bloquear-tempo/:id", autenticar, autorizarAdmin, usuarioController.bloquearPorTempo);
userRoutes.put("/desbloquear/:id", autenticar, autorizarAdmin, usuarioController.desbloquearUsuario); 
userRoutes.put("/admin/:id", autenticar, autorizarAdmin, usuarioController.atribuirAdmin);
userRoutes.delete("/admin/:id", autenticar, autorizarAdmin, usuarioController.deletarUsuario);

module.exports = userRoutes;
