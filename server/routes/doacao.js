const express = require("express");
const DoacaoRoutes = express.Router();
const Doacao = require("../models/doacao");// se der erro, ver se o caminho está correto
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
DoacaoRoutes.post("/doacao/add", upload.array('fotos', 5), async (req, res) => {
  const {
    nome, modelo, marca, descricao, especificacao, potencia, tamanho,
    observacao, tipo, tipoMaterial, status, cor, endereco
  } = req.body;
  const fotos = req.files ? req.files.map(file => file.filename) : [];

  const novaDoacao = new Doacao({
    nome, modelo, marca, descricao, especificacao, potencia, tamanho,
    fotos, observacao, tipo, tipoMaterial, status, cor, endereco
  });

  try {
    const savedDoacao = await novaDoacao.save();
    res.status(201).json(savedDoacao);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GET - Listar todas as doações
DoacaoRoutes.get("/doacao", async (req, res) => {
  try {
    const doacoes = await Doacao.find();
    res.status(200).json(doacoes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = DoacaoRoutes;