const express = require("express");
const DoacaoRoutes = express.Router();
const doacaoController = require("../controllers/doacaoController");
const multer = require("multer");
const path = require("path");
const { autenticar } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST - Criar nova doação
DoacaoRoutes.post("/doacao/add", autenticar, upload.array('fotos', 5), doacaoController.criarDoacao);

// GET - Listar todas as doações
DoacaoRoutes.get("/doacao", doacaoController.listarDoacoes);

// DELETE - Remover doação por ID
DoacaoRoutes.delete("/doacao/:id", autenticar, doacaoController.deletarDoacao);

module.exports = DoacaoRoutes;