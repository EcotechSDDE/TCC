import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050"; // backend

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      // Observe que agora é /user/login
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text(); // pega a resposta completa
        console.error("Erro no login:", text);
        window.alert(
          `Erro ao fazer login: ${response.status} ${response.statusText}`
        );
        return;
      }

      const result = await response.json();

      if (result.token && result.usuario) {
        // Salva token e usuário no contexto e localStorage
        setToken(result.token);
        setUser(result.usuario);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.usuario));
        localStorage.setItem("tipo", result.usuario.tipo);

        navigate("/produtos"); // redireciona para página de produtos
      } else {
        window.alert("Credenciais inválidas.");
      }

      setForm({ email: "", password: "" });
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      window.alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EcoTech</h1>
      <h2 style={styles.subtitle}>
        Sistema de Doações de Equipamentos Eletrônicos
      </h2>

      <div style={styles.content}>
        <div style={styles.textContainer}>
          <p style={styles.text}>
            O sistema foi desenvolvido para gerenciar a doação de equipamentos
            eletrônicos, proporcionando um local adequado para o descarte
            responsável, assegurando a destinação correta e incentivando a
            conscientização ambiental.
          </p>
        </div>

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
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#6f9064",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    maxWidth: "750px",
    width: "90%",
    margin: "40px auto",
    borderRadius: "20px",
  },
  title: { fontSize: "2rem", marginBottom: "5px" },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "20px",
    textAlign: "center",
    maxWidth: "500px",
  },
  form: {
    backgroundColor: "#C8E6C9",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "260px",
    marginBottom: "20px",
  },
  label: { fontSize: "0.9rem", color: "#333" },
  input: {
    padding: "8px",
    fontSize: "0.95rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px",
    backgroundColor: "#3b5534",
    color: "#fff",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  registerButton: {
    marginTop: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "#333",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    maxWidth: "700px",
    width: "100%",
    marginTop: "10px",
  },
  textContainer: {
    maxWidth: "350px",
    textAlign: "justify",
    padding: "8px",
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    color: "#333",
  },
  text: { fontSize: "0.95rem", lineHeight: "1.4" },
};
