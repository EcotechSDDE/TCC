const Denuncia = require('../models/Denuncia');

// Criar nova denúncia (usuário logado)
exports.criarDenuncia = async (req, res) => {
  try {
    const { doacao, motivo } = req.body;

    // Pega o usuário logado do middleware autenticar
    const usuarioId = req.usuario.id;

    if (!usuarioId) {
      return res.status(401).json({ message: "Você precisa estar logado" });
    }

    // Cria a denúncia
    const novaDenuncia = new Denuncia({
      usuario: usuarioId,
      doacao,
      motivo,
      status: "pendente",
    });

    await novaDenuncia.save();

    res.status(201).json({ message: "Denúncia criada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Listar todas as denúncias (admin)
exports.listarDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.find().populate('usuario', 'nome email').populate('doacao', 'nome');
    res.status(200).json(denuncias);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Resolver denúncia (admin)
exports.resolverDenuncia = async (req, res) => {
  try {
    const denuncia = await Denuncia.findById(req.params.id);
    if (!denuncia) return res.status(404).json({ message: 'Denúncia não encontrada' });

    denuncia.status = 'resolvida';
    await denuncia.save();

    res.status(200).json({ status: denuncia.status });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
