import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050'; // Seu back-end

export default function Login() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        // Enviar os dados para o backend (ajuste a rota conforme sua API)
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (!response.ok) {
            const message = `Erro ao fazer login: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const result = await response.json();

        if (result.success) {
            // Você pode salvar token se necessário
            // localStorage.setItem("token", result.token);
            navigate("/home"); // Redirecionar após login
        } else {
            window.alert("Credenciais inválidas.");
        }

        setForm({ name: "", email: "", password: "" });
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>EcoTech</h1>
            <h2 style={styles.subtitle}>Sistema de Doações de Equipamentos Eletrônicos</h2>

            <form onSubmit={onSubmit} style={styles.form}>
                <label style={styles.label}>Nome</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Senha</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button}>Cadastrar</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#4CAF50",
        minHeight: "90vh",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff"
    },
    title: {
        fontSize: "2.5rem",
        marginBottom: "10px"
    },
    subtitle: {
        fontSize: "1.2rem",
        marginBottom: "30px",
        textAlign: "center",
        maxWidth: "600px"
    },
    form: {
        backgroundColor: "#C8E6C9",
        padding: "30px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "300px"
    },
    label: {
        fontSize: "1rem",
        color: "#333"
    },
    input: {
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    button: {
        padding: "10px",
        backgroundColor: "#4f83cc",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};
