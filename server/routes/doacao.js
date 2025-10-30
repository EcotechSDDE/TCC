const express = require("express");
const DoacaoRoutes = express.Router();
const doacaoController = require("../controllers/doacaoController");
const multer = require("multer");
const path = require("path");
const { autenticar, autorizarAdmin } = require('../middleware/auth');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

DoacaoRoutes.post("/add", autenticar, upload.array('fotos', 5), doacaoController.criarDoacao); // /doacao/add
DoacaoRoutes.get("/", doacaoController.listarDoacoes); // /doacao
DoacaoRoutes.get("/minhas", autenticar, doacaoController.minhasDoacoes); // Rota para listar as doações do usuário logado
DoacaoRoutes.get("/:id", doacaoController.buscarDoacaoPorId); // /doacao/:id
DoacaoRoutes.delete("/:id", autenticar, doacaoController.deletarDoacao);
DoacaoRoutes.put('/:id', autenticar, autorizarAdmin, doacaoController.editarDoacao);
DoacaoRoutes.delete('/:id/admin', autenticar, autorizarAdmin, doacaoController.removerDoacaoAdmin);
DoacaoRoutes.put('/:id/status', autenticar, autorizarAdmin, doacaoController.alterarStatusDoacao);

module.exports = DoacaoRoutes;
