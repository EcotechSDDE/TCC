import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050'; 

export default function Produtos() {
    const [doacoes, setDoacoes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDoacoes() {
            const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao`);
            if (!response.ok) {
                window.alert("Erro ao buscar doações");
                return;
            }
            const data = await response.json();
            setDoacoes(data);
        }
        fetchDoacoes();
    }, []);

    const doacoesFiltradas = doacoes.filter((item) => {
        const nomeMatch = item.nome.toLowerCase().includes(pesquisa.toLowerCase());
        const filtroMatch = filtro ? item.nome.toLowerCase().includes(filtro.toLowerCase()) : true;
        return nomeMatch && filtroMatch;
    });

    return (
        <div style={styles.container}>
            {/* Abas superiores conectadas */}
            <div style={styles.abasContainer}>
                <div style={styles.abasEsquerda}>
                    <button style={{ ...styles.aba, ...styles.abaAtiva }}>Receber</button>
                    <button
                        style={styles.aba}
                        onClick={() => navigate("/cadastroProduto")}
                    >
                        Doar
                    </button>
                    <div style={styles.abaPesquisaFiltro}>
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={pesquisa}
                            onChange={e => setPesquisa(e.target.value)}
                            style={styles.pesquisa}
                        />
                        <select
                            value={filtro}
                            onChange={e => setFiltro(e.target.value)}
                            style={styles.filtro}
                        >
                            <option value="">Filtrar</option>
                            <option value="notebook">Notebook</option>
                            <option value="celular">Celular</option>
                            <option value="monitor">Monitor</option>
                            <option value="impressora">Impressora</option>
                            <option value="tablet">Tablet</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Quadrado grande */}
            <div style={styles.quadradoGrande}>
                {doacoesFiltradas.length === 0 && (
                    <div style={{ color: "#333", textAlign: "center", width: "100%" }}>Nenhuma doação encontrada.</div>
                )}
                {doacoesFiltradas.map((item) => (
                    <div key={item._id || item.id} style={styles.quadradoPequeno}>
                        <img
                            src={item.fotos && item.fotos.length > 0 ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${item.fotos[0]}` : "/Logo.png"}
                            alt={item.nome}
                            style={styles.imagem}
                        />
                        <div style={styles.nome}>{item.nome}</div>
                        <button
                            style={styles.contato}
                            onClick={() => navigate(`/detalhesProduto/${item._id}`)}
                        >
                            Mostrar Mais
                        </button>
                    </div>
                ))}
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
        backgroundColor: "#88bd8a",
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
        backgroundColor: "#6f9064",
        color: "#fff",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottom: "none"
    },
    abaPesquisaFiltro: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#88bd8a",
        borderTopRightRadius: "16px",
        borderTopLeftRadius: "16px",
        padding: "0 18px",
        height: "54px",
        marginLeft: "2px",
        zIndex: 2
    },
    pesquisa: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        marginRight: "10px"
    },
    filtro: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "1rem"
    },
    quadradoGrande: {
        backgroundColor: "#6f9064",
        borderRadius: "0 24px 24px 24px",
        padding: "50px 40px 40px 40px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        width: "1200px",
        minHeight: "320px",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginTop: "0px"
    },
    quadradoPequeno: {
        backgroundColor: "#C8E6C9",
        borderRadius: "12px",
        width: "190px",
        height: "253px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 10px",
        boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
        margin: "0"
    },
    imagem: {
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "10px",
        marginTop: "10px"
    },
    nome: {
        fontWeight: "bold",
        color: "#3b5534",
        fontSize: "1.2rem",
        marginBottom: "10px",
        textAlign: "center"
    },
    contato: {
        backgroundColor: "#3b5534",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "10px 0",
        cursor: "pointer",
        fontSize: "1rem",
        width: "100%",
        marginTop: "auto",
        marginBottom: "0"
    }
};