import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050';

export default function DetalhesProduto() {
    const { id } = useParams();
    const [doacao, setDoacao] = useState(null);
    const [selectedImgIdx, setSelectedImgIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);
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
                {/* Imagens à esquerda - agora carrossel */}
                <div style={styles.imagensContainer}>
                    {/* Imagem principal (carrossel) */}
                    <div style={{ position: 'relative', width: zoomed ? '100vw' : 220, height: zoomed ? '100vh' : 220, marginBottom: 10, zIndex: zoomed ? 9999 : 1 }}>
                        {/* Fundo escurecido no modo zoom */}
                        {zoomed && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.7)',
                                zIndex: 9998
                            }} onClick={() => setZoomed(false)} />
                        )}
                        {/* Quadrado centralizado para imagem ampliada */}
                        <div style={{
                            position: zoomed ? 'fixed' : 'static',
                            top: zoomed ? '50%' : undefined,
                            left: zoomed ? '50%' : undefined,
                            transform: zoomed ? 'translate(-50%, -50%)' : undefined,
                            background: '#fff',
                            borderRadius: zoomed ? 24 : 12,
                            boxShadow: zoomed ? '0 0 40px #0008' : 'none',
                            width: zoomed ? '80vw' : 220,
                            height: zoomed ? '80vh' : 220,
                            zIndex: zoomed ? 9999 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={doacao.fotos && doacao.fotos.length > 0 ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${doacao.fotos[selectedImgIdx]}` : "/Logo.png"}
                                alt={doacao.nome}
                                style={{
                                    ...styles.imagem,
                                    cursor: 'pointer',
                                    width: zoomed ? '100%' : 220,
                                    height: zoomed ? '100%' : 220,
                                    objectFit: 'contain',
                                    background: '#fff',
                                    borderRadius: zoomed ? 24 : 12,
                                    zIndex: zoomed ? 9999 : 1
                                }}
                                onClick={() => setZoomed(!zoomed)}
                            />
                            {/* Botão fechar no canto superior direito do quadrado */}
                            {zoomed && (
                                <button
                                    style={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        fontSize: 32,
                                        cursor: 'pointer',
                                        zIndex: 10001,
                                        boxShadow: '0 0 10px #0004',
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={e => { e.stopPropagation(); setZoomed(false); }}
                                >&#10006;</button>
                            )}
                            {/* Botões de navegação no modo zoom, dentro do quadrado */}
                            {doacao.fotos && doacao.fotos.length > 1 && zoomed && (
                                <>
                                    {/* Botão voltar (esquerda) */}
                                    <button
                                        style={{
                                            position: 'absolute',
                                            left: 16,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            fontSize: 32,
                                            cursor: 'pointer',
                                            zIndex: 10000,
                                            boxShadow: '0 0 10px #0004',
                                            width: 56,
                                            height: 56,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={e => { e.stopPropagation(); setSelectedImgIdx(idx => idx > 0 ? idx - 1 : doacao.fotos.length - 1); }}
                                    >&lt;</button>
                                    {/* Botão avançar (direita) */}
                                    <button
                                        style={{
                                            position: 'absolute',
                                            right: 16,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            fontSize: 32,
                                            cursor: 'pointer',
                                            zIndex: 10000,
                                            boxShadow: '0 0 10px #0004',
                                            width: 56,
                                            height: 56,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={e => { e.stopPropagation(); setSelectedImgIdx(idx => idx < doacao.fotos.length - 1 ? idx + 1 : 0); }}
                                    >&gt;</button>
                                </>
                            )}
                            {/* Botões de navegação no modo normal */}
                            {doacao.fotos && doacao.fotos.length > 1 && !zoomed && (
                                <>
                                    <button style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', fontSize: 18, cursor: 'pointer', zIndex: 10000, boxShadow: '0 0 10px #0004' }}
                                        onClick={e => { e.stopPropagation(); setSelectedImgIdx(idx => idx > 0 ? idx - 1 : doacao.fotos.length - 1); }}>&lt;</button>
                                    <button style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', fontSize: 18, cursor: 'pointer', zIndex: 10000, boxShadow: '0 0 10px #0004' }}
                                        onClick={e => { e.stopPropagation(); setSelectedImgIdx(idx => idx < doacao.fotos.length - 1 ? idx + 1 : 0); }}>&gt;</button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Miniaturas */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        {doacao.fotos && doacao.fotos.length > 0 && doacao.fotos.map((foto, idx) => (
                            <img
                                key={idx}
                                src={`${REACT_APP_YOUR_HOSTNAME}/uploads/${foto}`}
                                alt={doacao.nome}
                                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: idx === selectedImgIdx ? '2px solid #3b5534' : '2px solid #ccc', cursor: 'pointer' }}
                                onClick={() => { setSelectedImgIdx(idx); setZoomed(false); }}
                            />
                        ))}
                    </div>
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