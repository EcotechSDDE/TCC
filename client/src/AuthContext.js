import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5050/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}