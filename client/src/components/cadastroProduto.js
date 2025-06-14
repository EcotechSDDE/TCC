import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050';

export default function CadastroProduto() {
    const [form, setForm] = useState({
        nome: "",
        modelo: "",
        marca: "",
        descricao: "",
        especificacao: "",
        potencia: "",
        tamanho: "",
        fotos: [],
        observacao: "",
        tipo: "",
        tipoMaterial: "",
        status: "",
        cor: "",
        endereco: ""
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "fotos") {
                for (let i = 0; i < value.length; i++) {
                    formData.append("fotos", value[i]);
                }
            } else {
                formData.append(key, value);
            }
        });

        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao/add`, {
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
            <h1 style={styles.title}>Cadastrar Doação</h1>
            <form onSubmit={onSubmit} style={styles.form} encType="multipart/form-data">
                <label style={styles.label}>Nome*</label>
                <input type="text" value={form.nome} onChange={e => updateForm({ nome: e.target.value })} style={styles.input} required />

                <label style={styles.label}>Modelo</label>
                <input type="text" value={form.modelo} onChange={e => updateForm({ modelo: e.target.value })} style={styles.input} />

                <label style={styles.label}>Marca</label>
                <input type="text" value={form.marca} onChange={e => updateForm({ marca: e.target.value })} style={styles.input} />

                <label style={styles.label}>Descrição</label>
                <textarea value={form.descricao} onChange={e => updateForm({ descricao: e.target.value })} style={styles.input} />

                <label style={styles.label}>Especificação</label>
                <input type="text" value={form.especificacao} onChange={e => updateForm({ especificacao: e.target.value })} style={styles.input} />

                <label style={styles.label}>Potência</label>
                <input type="text" value={form.potencia} onChange={e => updateForm({ potencia: e.target.value })} style={styles.input} />

                <label style={styles.label}>Tamanho</label>
                <input type="text" value={form.tamanho} onChange={e => updateForm({ tamanho: e.target.value })} style={styles.input} />

                <label style={styles.label}>Fotos</label>
                <input type="file" multiple accept="image/*" onChange={e => updateForm({ fotos: e.target.files })} style={styles.input} />

                <label style={styles.label}>Observação</label>
                <input type="text" value={form.observacao} onChange={e => updateForm({ observacao: e.target.value })} style={styles.input} />

                <label style={styles.label}>Tipo</label>
                <input type="text" value={form.tipo} onChange={e => updateForm({ tipo: e.target.value })} style={styles.input} />

                <label style={styles.label}>Tipo Material</label>
                <input type="text" value={form.tipoMaterial} onChange={e => updateForm({ tipoMaterial: e.target.value })} style={styles.input} />

                <label style={styles.label}>Status</label>
                <input type="text" value={form.status} onChange={e => updateForm({ status: e.target.value })} style={styles.input} />

                <label style={styles.label}>Cor</label>
                <input type="text" value={form.cor} onChange={e => updateForm({ cor: e.target.value })} style={styles.input} />

                <label style={styles.label}>Endereço</label>
                <input type="text" value={form.endereco} onChange={e => updateForm({ endereco: e.target.value })} style={styles.input} />

                <button type="submit" style={styles.button}>Cadastrar Doação</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#3b5534", // cor diferente para destacar
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        paddingTop: "30px",
        minHeight: "100vh"
    },
    title: {
        fontSize: "2.2rem",
        marginBottom: "20px"
    },
    form: {
        backgroundColor: "#C8E6C9",
        padding: "30px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "400px",
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
        backgroundColor: "#6f9064",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};