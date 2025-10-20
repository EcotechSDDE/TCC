// middleware/autorizarAdmin.js
export function autorizarAdmin(req, res, next) {
  try {
    // Verifica se o middleware de autenticação já preencheu req.usuario
    if (!req.usuario) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Verifica se o tipo de usuário é admin
    if (req.usuario.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso negado: apenas administradores podem ver esta rota" });
    }

    next();
  } catch (error) {
    console.error("Erro no middleware autorizarAdmin:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
