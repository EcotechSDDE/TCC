import React, { useState, useEffect } from "react";

// Exemplo de dados estáticos (substitua por fetch do backend depois)
const mockDoacoes = [
    { id: 1, nome: "Notebook", imagem: "/Logo.png", contato: "email@exemplo.com" },
    { id: 2, nome: "Celular", imagem: "/Logo.png", contato: "email@exemplo.com" },
    { id: 3, nome: "Monitor", imagem: "/Logo.png", contato: "email@exemplo.com" },
    { id: 4, nome: "Impressora", imagem: "/Logo.png", contato: "email@exemplo.com" },
    { id: 5, nome: "Tablet", imagem: "/Logo.png", contato: "email@exemplo.com" }
];

export default function Produtos() {
    const [doacoes, setDoacoes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        setDoacoes(mockDoacoes);
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
                        onClick={() => window.location.href = "/cadastro-doacao"}
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
                {doacoesFiltradas.slice(0, 5).map((item) => (
                    <div key={item.id} style={styles.quadradoPequeno}>
                        <img
                            src={item.imagem}
                            alt={item.nome}
                            style={styles.imagem}
                        />
                        <div style={styles.nome}>{item.nome}</div>
                        <button
                            style={styles.contato}
                            onClick={() => window.open(`mailto:${item.contato}`)}
                        >
                            Entrar em contato
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
        backgroundColor: "#C8E6C9",
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
        borderTopLeftRadius: "0px",
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
        borderRadius: "0 0 24px 24px",
        padding: "50px 40px 40px 40px",
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        width: "1200px",
        minHeight: "320px",
        justifyContent: "flex-start",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginTop: "0px"
    },
    quadradoPequeno: {
        backgroundColor: "#C8E6C9",
        borderRadius: "12px",
        width: "180px",
        height: "240px",
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