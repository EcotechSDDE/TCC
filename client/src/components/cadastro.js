import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050'; // Seu back-end

export default function Cadastro() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        cpfCnpj: "",
        imagem: null
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nome", form.nome);
        formData.append("email", form.email);
        formData.append("telefone", form.telefone);
        formData.append("dataNascimento", form.dataNascimento);
        formData.append("cpfCnpj", form.cpfCnpj);
        if (form.imagem) {
            formData.append("imagem", form.imagem);
        }

        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/add`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const message = `Erro ao cadastrar: ${response.statusText}`;
            window.alert(message);
            return;
        }

        navigate("/produtos");
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>EcoTech</h1>
            <h2 style={styles.subtitle}>Crie seu perfil para doar ou receber equipamentos</h2>

            <form onSubmit={onSubmit} style={styles.form} encType="multipart/form-data">
                <label style={styles.label}>Nome</label>
                <input
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={form.nome}
                    onChange={(e) => updateForm({ nome: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Email</label>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Telefone</label>
                <input
                    type="tel"
                    placeholder="(99) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => updateForm({ telefone: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Data de Nascimento</label>
                <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => updateForm({ dataNascimento: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>CPF/CNPJ</label>
                <input
                    type="text"
                    placeholder="Digite seu CPF ou CNPJ"
                    value={form.cpfCnpj}
                    onChange={(e) => updateForm({ cpfCnpj: e.target.value })}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Imagem de Perfil</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateForm({ imagem: e.target.files[0] })}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>Criar Perfil</button>
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
        width: "300px",
        marginBottom: "35px"
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
        backgroundColor: "#3b5534",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};