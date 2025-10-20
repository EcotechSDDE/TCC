import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5050/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Token inválido");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Erro ao buscar usuário logado:", err);
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [token]);

  const login = (newToken, usuario) => {
    setToken(newToken);
    setUser(usuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(usuario));
    localStorage.setItem("tipo", usuario.tipo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tipo");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
