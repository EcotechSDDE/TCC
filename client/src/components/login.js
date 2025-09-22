import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050"; // Seu back-end

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const message = `Erro ao fazer login: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const result = await response.json();

    if (result.token) {
      setToken(result.token);
      navigate("/produtos");
    } else {
      window.alert("Credenciais inválidas.");
    }

    setForm({ email: "", password: "" });
  }

  const token = localStorage.getItem("token");
  fetch("/rota-protegida", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/"); // ou para a rota de login
    }
  });

  const tipo = localStorage.getItem("tipo");
  if (tipo === "admin") {
    /* mostra recursos de admin */
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EcoTech</h1>
      <h2 style={styles.subtitle}>
        Sistema de Doações de Equipamentos Eletrônicos
      </h2>

      <form onSubmit={onSubmit} style={styles.form}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          placeholder="Digite seu email"
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
          style={styles.input}
          required
        />

        <label style={styles.label}>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={form.password}
          onChange={(e) => updateForm({ password: e.target.value })}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Entrar
        </button>
        <button
          type="button"
          onClick={() => navigate("/cadastro")}
          style={styles.registerButton}
        >
          Ainda não tem uma conta? Cadastre-se
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#6f9064",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    paddingTop: "30px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    textAlign: "center",
    maxWidth: "600px",
  },
  form: {
    backgroundColor: "#C8E6C9",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
    marginBottom: "35px",
  },
  label: {
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#3b5534",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  registerButton: {
    marginTop: "15px",
    backgroundColor: "transparent",
    border: "none",
    color: "rgb(51, 51, 51)",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "1rem",
  },
};
