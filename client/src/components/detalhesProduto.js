import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050';

export default function DetalhesProduto() {
    const { id } = useParams();
    const [doacao, setDoacao] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDoacao() {
            const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao`);
            if (!response.ok) {
                window.alert("Erro ao buscar doação");
                return;
            }
            const data = await response.json();
            // Busca a doação pelo id (ajuste conforme sua rota se necessário)
            const found = data.find(d => d._id === id);
            setDoacao(found);
        }
        fetchDoacao();
    }, [id]);

    if (!doacao) {
        return <div style={{ color: "#3b5534", textAlign: "center", marginTop: "40px" }}>Carregando detalhes...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Aba superior */}
            <div style={styles.abasContainer}>
                <div style={styles.abaAtiva}>Detalhes</div>
            </div>

            {/* Quadrado grande */}
            <div style={styles.quadradoGrande}>
                {/* Imagens à esquerda */}
                <div style={styles.imagensContainer}>
                    {doacao.fotos && doacao.fotos.length > 0 ? (
                        doacao.fotos.map((foto, idx) => (
                            <img
                                key={idx}
                                src={`${REACT_APP_YOUR_HOSTNAME}/uploads/${foto}`}
                                alt={doacao.nome}
                                style={styles.imagem}
                            />
                        ))
                    ) : (
                        <img src="/Logo.png" alt="Sem imagem" style={styles.imagem} />
                    )}
                </div>
                {/* Informações à direita */}
                <div style={styles.infoContainer}>
                    <div style={styles.info}><b>Nome do produto:</b> {doacao.nome}</div>
                    <div style={styles.info}><b>Modelo:</b> {doacao.modelo}</div>
                    <div style={styles.info}><b>Marca:</b> {doacao.marca}</div>
                    <div style={styles.info}><b>Descrição:</b> {doacao.descricao}</div>
                    <div style={styles.info}><b>Especificação:</b> {doacao.especificacao}</div>
                    <div style={styles.info}><b>Potência:</b> {doacao.potencia}</div>
                    <div style={styles.info}><b>Tamanho:</b> {doacao.tamanho}</div>
                    <div style={styles.info}><b>Observação:</b> {doacao.observacao}</div>
                    <div style={styles.info}><b>Tipo:</b> {doacao.tipo}</div>
                    <div style={styles.info}><b>Tipo Material:</b> {doacao.tipoMaterial}</div>
                    <div style={styles.info}><b>Status:</b> {doacao.status}</div>
                    <div style={styles.info}><b>Cor:</b> {doacao.cor}</div>
                    <div style={styles.info}><b>Endereço:</b> {doacao.endereco}</div>
                    <button
                        style={styles.button}
                        onClick={() => navigate("/contatos")}
                    >
                        Ir para Contatos
                    </button>
                </div>
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
        width: "900px",
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "0px"
    },
    abaAtiva: {
        backgroundColor: "#6f9064",
        color: "#fff",
        borderRadius: "16px 16px 0 0",
        padding: "16px 50px",
        fontWeight: "bold",
        fontSize: "1.2rem"
    },
    quadradoGrande: {
        backgroundColor: "#C8E6C9",
        borderRadius: "0 0 24px 24px",
        padding: "40px",
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        width: "900px",
        minHeight: "320px",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginTop: "0px"
    },
    imagensContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        width: "240px"
    },
    imagem: {
        width: "200px",
        height: "200px",
        objectFit: "cover",
        borderRadius: "12px",
        background: "#fff"
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1
    },
    info: {
        fontSize: "1.05rem",
        color: "#3b5534"
    },
    button: {
        marginTop: "30px",
        padding: "12px",
        backgroundColor: "#6f9064",
        color: "#fff",
        fontSize: "1.1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        width: "220px"
    }
};