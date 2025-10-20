const Suporte = require('../models/Suporte');

exports.listarMensagensSuporte = async (req, res) => {
    try {
        const mensagens = await Suporte.find().populate('usuario');
        res.status(200).json(mensagens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.responderMensagemSuporte = async (req, res) => {
    try {
        const suporte = await Suporte.findById(req.params.id);
        if (!suporte) return res.status(404).json({ message: 'Mensagem não encontrada' });
        suporte.resposta = req.body.resposta;
        suporte.status = 'respondida';
        await suporte.save();
        res.status(200).json(suporte);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
