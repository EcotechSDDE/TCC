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
            {/* Abas superiores conectadas */}
            <div style={styles.abasContainer}>
                <div style={styles.abasEsquerda}>
                    <button
                        style={styles.aba}
                        onClick={() => navigate("/produtos")}
                    >
                        Receber
                    </button>
                    <button
                        style={{ ...styles.aba, ...styles.abaAtiva }}
                        disabled
                    >
                        Doar
                    </button>
                </div>
            </div>

            <div style={styles.quadradoGrande}>
                <form onSubmit={onSubmit} style={styles.form} encType="multipart/form-data">
                    <label style={styles.label}>Nome*</label>
                    <input type="text" placeholder="Ex: Notebook" value={form.nome} onChange={e => updateForm({ nome: e.target.value })} style={styles.input} required />

                    <label style={styles.label}>Modelo</label>
                    <input type="text" placeholder="Ex: Inspiron 15" value={form.modelo} onChange={e => updateForm({ modelo: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Marca</label>
                    <input type="text" placeholder="Ex: Dell" value={form.marca} onChange={e => updateForm({ marca: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Descrição</label>
                    <textarea placeholder="Descreva o produto" value={form.descricao} onChange={e => updateForm({ descricao: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Especificação</label>
                    <input type="text" placeholder="Ex: 8GB RAM, SSD 256GB" value={form.especificacao} onChange={e => updateForm({ especificacao: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Potência</label>
                    <input type="text" placeholder="Ex: 65W" value={form.potencia} onChange={e => updateForm({ potencia: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Tamanho</label>
                    <input type="text" placeholder="Ex: 15.6 polegadas" value={form.tamanho} onChange={e => updateForm({ tamanho: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Fotos</label>
                    <input type="file" multiple accept="image/*" onChange={e => updateForm({ fotos: e.target.files })} style={styles.input} />

                    <label style={styles.label}>Observação</label>
                    <input type="text" placeholder="Ex: Pequeno risco na tampa" value={form.observacao} onChange={e => updateForm({ observacao: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Tipo</label>
                    <input type="text" placeholder="Ex: Eletrônico" value={form.tipo} onChange={e => updateForm({ tipo: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Tipo Material</label>
                    <input type="text" placeholder="Ex: Plástico" value={form.tipoMaterial} onChange={e => updateForm({ tipoMaterial: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Status</label>
                    <input type="text" placeholder="Ex: Usado" value={form.status} onChange={e => updateForm({ status: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Cor</label>
                    <input type="text" placeholder="Ex: Preto" value={form.cor} onChange={e => updateForm({ cor: e.target.value })} style={styles.input} />

                    <label style={styles.label}>Endereço</label>
                    <input type="text" placeholder="Ex: Rua das Flores, 123" value={form.endereco} onChange={e => updateForm({ endereco: e.target.value })} style={styles.input} />

                    <button type="submit" style={styles.button}>Cadastrar Doação</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px"
    },
    abasContainer: {
        width: "1200px",
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "0px"
    },
    abasEsquerda: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: "0px"
    },
    aba: {
        padding: "14px 38px 18px 38px",
        backgroundColor: "#6f9064",
        border: "none",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottom: "none",
        color: "#3b5534",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "1.1rem",
        marginRight: "2px",
        zIndex: 2
    },
    abaAtiva: {
        backgroundColor: "#88bd8a",
        color: "#3b5534",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottom: "none"
    },
    abaPesquisaFiltro: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#C8E6C9",
        borderTopRightRadius: "16px",
        borderTopLeftRadius: "16px",
        padding: "0 18px",
        height: "54px",
        marginLeft: "2px",
        zIndex: 2
    },
    quadradoGrande: {
        backgroundColor: "#88bd8a",
        borderRadius: "0 24px 24px 24px",
        padding: "50px 40px 40px 40px",
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        width: "1200px",
        minHeight: "320px",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginTop: "0px"
    },
    form: {
        backgroundColor: "#6f9064",
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
        backgroundColor: "#C8E6C9",
        color: "#3b5534",
        fontSize: "1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};