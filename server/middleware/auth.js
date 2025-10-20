const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'seusegredoaqui';

function autenticar(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido ou expirado' });

    req.usuario = {
      _id: decoded.id,
      id: decoded.id,
      email: decoded.email,
      tipo: decoded.tipo,
    };

    next();
  });
}

function autorizarAdmin(req, res, next) {
  if (req.usuario?.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado: apenas administradores podem realizar esta ação.' });
  }
  next();
}

module.exports = { autenticar, autorizarAdmin };
