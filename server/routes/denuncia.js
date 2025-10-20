const express = require("express");
const router = express.Router();
const denunciaController = require("../controllers/denunciaController");
const { autenticar, autorizarAdmin } = require("../middleware/auth");

// Criar denúncia (usuário comum)
router.post("/denuncia", autenticar, denunciaController.criarDenuncia);

// Listar todas as denúncias (apenas admin)
router.get("/denuncia", autenticar, autorizarAdmin, denunciaController.listarDenuncias);

// Resolver denúncia (apenas admin)
router.put("/denuncia/:id/resolver", autenticar, autorizarAdmin, denunciaController.resolverDenuncia);

module.exports = router;
