import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);

    const carregarUsuario = async () => {
      try {
        const res = await fetch("http://localhost:5050/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
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
        setUser(null);
        setToken("");
      }
    };

    carregarUsuario();
  }, [token]);

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
