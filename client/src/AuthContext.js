import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Logout seguro com mensagem
  const logout = useCallback((mensagem) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tipo");
    setToken("");
    setUser(null);

    if (mensagem) window.alert(mensagem);
    navigate("/login");
  }, [navigate]);

  // 🔹 Carrega usuário e agenda logout automático
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let timer;

    const carregarUsuario = async () => {
      try {
        // Decodifica token
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        const agora = Date.now();
        const tempoRestante = exp - agora;

        if (tempoRestante <= 0) {
          logout("Sua sessão expirou. Faça login novamente.");
          return;
        }

        // Agenda logout automático
        timer = setTimeout(() => {
          logout("Sua sessão expirou. Faça login novamente.");
        }, tempoRestante);

        // Busca usuário logado
        const res = await fetch("http://localhost:5050/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Token inválido");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Erro ao buscar usuário logado:", err);
        logout("Sessão inválida ou expirada. Faça login novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();

    return () => clearTimeout(timer); // Limpa timer ao trocar token ou desmontar
  }, [token, logout]);

  // 🔹 Login: salva token, usuário e tipo
  const login = (newToken, usuario) => {
    setToken(newToken);
    setUser(usuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(usuario));
    localStorage.setItem("tipo", usuario.tipo);
  };

  // 🔹 Fetch protegido: desloga se token inválido
  const fetchComToken = async (url, options = {}) => {
    const finalOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch(url, finalOptions);
      if (res.status === 401) {
        logout("Sua sessão expirou. Faça login novamente.");
        return;
      }
      return res;
    } catch (err) {
      console.error("Erro no fetch:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        login,
        logout,
        loading,
        fetchComToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
