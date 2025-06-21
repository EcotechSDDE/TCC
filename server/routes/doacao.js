const express = require("express");
const DoacaoRoutes = express.Router();
const doacaoController = require("../controllers/doacaoController");
const multer = require("multer");
const path = require("path");

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
DoacaoRoutes.post("/doacao/add", upload.array('fotos', 5), doacaoController.criarDoacao);

// GET - Listar todas as doações
DoacaoRoutes.get("/doacao", doacaoController.listarDoacoes);

module.exports = DoacaoRoutes;