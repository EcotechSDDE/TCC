import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function DetalhesProduto() {
  const { id } = useParams();
  const [doacao, setDoacao] = useState(null);
  const [isDono, setIsDono] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoacao() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao`);
        if (!response.ok) {
          window.alert("Erro ao buscar doação");
          return;
        }
        const data = await response.json();
        const found = data.find((d) => d._id === id);
        setDoacao(found);

        const rawUser = localStorage.getItem("user");
        let user = null;
        try {
          user = rawUser ? JSON.parse(rawUser) : null;
        } catch (e) {
          user = null;
        }

        let ownerId = "";
        if (found) {
          if (found.usuario) {
            ownerId =
              typeof found.usuario === "string"
                ? found.usuario
                : found.usuario._id || found.usuario.id || "";
          } else if (found.userId) {
            ownerId = found.userId;
          } else if (found.usuarioId) {
            ownerId = found.usuarioId;
          } else if (found.owner) {
            ownerId = found.owner;
          }
        }

        let currentUserId = "";
        if (user) {
          currentUserId = user._id || user.id || user.userId || "";
        } else {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              currentUserId =
                payload.sub ||
                payload.id ||
                payload._id ||
                payload.userId ||
                "";
            } catch {
              currentUserId = "";
            }
          }
        }

        if (
          ownerId &&
          currentUserId &&
          String(ownerId) === String(currentUserId)
        ) {
          setIsDono(true);
        } else {
          setIsDono(false);
        }
      } catch (err) {
        console.error("Erro ao buscar doação:", err);
        window.alert("Erro ao buscar doação");
      }
    }
    fetchDoacao();
  }, [id]);

  if (!doacao) {
    return (
      <div style={{ color: "#3b5534", textAlign: "center", marginTop: "40px" }}>
        Carregando detalhes...
      </div>
    );
  }

  async function handleDenuncia() {
    if (!motivo.trim()) {
      alert("Por favor, descreva o motivo da denúncia.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para denunciar este produto.");
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/denuncia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doacao: doacao._id, motivo }),
      });

      if (response.ok) {
        alert("Denúncia enviada com sucesso! Obrigado por nos ajudar.");
        setMotivo("");
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao enviar denúncia: ${errorData.message || "Tente novamente"}`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao enviar denúncia.");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.abasContainer}>
        <div style={styles.abaAtiva}>Detalhes</div>
      </div>

      <div style={styles.quadradoGrande}>
        {/* ==== CARROSSEL ==== */}
        <div style={styles.imagensContainer}>
          <div
            style={{
              position: "relative",
              width: zoomed ? "100vw" : 220,
              height: zoomed ? "100vh" : 220,
              marginBottom: 10,
              zIndex: zoomed ? 9999 : 1,
            }}
          >
            {zoomed && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.7)",
                  zIndex: 9998,
                }}
                onClick={() => setZoomed(false)}
              />
            )}

            <div
              style={{
                position: zoomed ? "fixed" : "static",
                top: zoomed ? "50%" : undefined,
                left: zoomed ? "50%" : undefined,
                transform: zoomed ? "translate(-50%, -50%)" : undefined,
                background: "#fff",
                borderRadius: zoomed ? 24 : 12,
                boxShadow: zoomed ? "0 0 40px #0008" : "none",
                width: zoomed ? "80vw" : 220,
                height: zoomed ? "80vh" : 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                zIndex: zoomed ? 9999 : 1,
              }}
            >
              <img
                src={
                  doacao.fotos && doacao.fotos.length > 0
                    ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${doacao.fotos[selectedImgIdx]}`
                    : "/Logo.png"
                }
                alt={doacao.nome}
                style={{
                  width: zoomed ? "100%" : 220,
                  height: zoomed ? "100%" : 220,
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={() => setZoomed(!zoomed)}
              />

              {zoomed && (
                <button
                  style={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomed(false);
                  }}
                >
                  <FaTimes />
                </button>
              )}

              {doacao.fotos && doacao.fotos.length > 1 && (
                <>
                  <button
                    style={{
                      ...styles.arrowButton,
                      left: zoomed ? 16 : 0,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImgIdx((i) =>
                        i > 0 ? i - 1 : doacao.fotos.length - 1
                      );
                    }}
                  >
                    <FaArrowLeft />
                  </button>

                  <button
                    style={{
                      ...styles.arrowButton,
                      right: zoomed ? 16 : 0,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImgIdx((i) =>
                        i < doacao.fotos.length - 1 ? i + 1 : 0
                      );
                    }}
                  >
                    <FaArrowRight />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Miniaturas */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {doacao.fotos?.map((foto, idx) => (
              <img
                key={idx}
                src={`${REACT_APP_YOUR_HOSTNAME}/uploads/${foto}`}
                alt={doacao.nome}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 6,
                  border:
                    idx === selectedImgIdx
                      ? "2px solid #3b5534"
                      : "2px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedImgIdx(idx);
                  setZoomed(false);
                }}
              />
            ))}
          </div>
        </div>

        {/* ==== INFORMAÇÕES ==== */}
        <div style={styles.infoContainer}>
          {[
            ["Nome do produto", doacao.nome],
            ["Modelo", doacao.modelo],
            ["Marca", doacao.marca],
            ["Descrição", doacao.descricao],
            ["Especificação", doacao.especificacao],
            ["Potência", doacao.potencia],
            ["Tamanho", doacao.tamanho],
            ["Observação", doacao.observacao],
            ["Tipo", doacao.tipo],
            ["Tipo Material", doacao.tipoMaterial],
            ["Status", doacao.status],
            ["Cor", doacao.cor],
            ["Endereço", doacao.endereco],
          ].map(([label, value], i) => (
            <div key={i} style={styles.info}>
              <b>{label}:</b> {value}
            </div>
          ))}

          {!isDono && (
            <>
              <button
                style={styles.button}
                onClick={() => navigate(`/contato/${doacao._id}`)}
              >
                Ir para Contatos
              </button>
              <button
                style={styles.reportButton}
                onClick={() => setShowModal(true)}
              >
                 Denunciar produto
              </button>
            </>
          )}
        </div>
      </div>

      {/* ==== MODAL ==== */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#3b5534" }}>Denunciar este produto</h3>
            <textarea
              placeholder="Descreva o motivo da denúncia..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button style={styles.sendButton} onClick={handleDenuncia}>
                Enviar denúncia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  abasContainer: { width: 900, display: "flex", justifyContent: "flex-start" },
  abaAtiva: {
    backgroundColor: "#6f9064",
    color: "#fff",
    borderRadius: "16px 16px 0 0",
    padding: "16px 50px",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  quadradoGrande: {
    backgroundColor: "#C8E6C9",
    borderRadius: "0 24px 24px 24px",
    padding: 40,
    display: "flex",
    flexDirection: "row",
    gap: 40,
    width: 900,
  },
  imagensContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  infoContainer: { display: "flex", flexDirection: "column", flex: 1, gap: 10 },
  info: { fontSize: "1.05rem", color: "#3b5534" },
  button: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#6f9064",
    color: "#fff",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: 220,
  },
  reportButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#6f9064",
    color: "#fff",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: 220,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: 26,
    cursor: "pointer",
    width: 48,
    height: 48,
    boxShadow: "0 0 10px #0004",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: 18,
    cursor: "pointer",
    width: 36,
    height: 36,
    boxShadow: "0 0 10px #0003",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    width: 400,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  textarea: {
    width: "100%",
    height: 100,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "none",
  },
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelButton: {
    backgroundColor: "#aaa",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 16px",
    cursor: "pointer",
  },
  sendButton: {
    backgroundColor: "#6f9064",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 16px",
    cursor: "pointer",
  },
};
