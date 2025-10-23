import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function DenunciasAdmin() {
  const { token, user } = useContext(AuthContext);
  const [denuncias, setDenuncias] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("denuncias");
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    if (user?.tipo !== "admin") {
      navigate("/produtos");
      return;
    }

    fetch(`${REACT_APP_YOUR_HOSTNAME}/denuncia`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setDenuncias(data.filter((d) => d.status !== "resolvida"))
      )
      .catch((err) => console.error(err));
  }, [token, user, navigate]);

  async function resolverDenuncia(id) {
    try {
      const res = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/denuncia/${id}/resolver`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setDenuncias((prev) => prev.filter((d) => d._id !== id));
        setDenunciaSelecionada((prev) => {
          if (!prev) return null;
          const novas = prev.denuncias.filter((x) => x._id !== id);
          if (novas.length === 0) return null;
          return { ...prev, denuncias: novas };
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function resolverTodas(idDoacao) {
    const confirmar = window.confirm(
      "Tem certeza que deseja resolver todas as denúncias desta doação?"
    );
    if (!confirmar) return;

    try {
      const res = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/denuncia/resolverDoacao/${idDoacao}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setDenuncias((prev) =>
          prev.filter((d) => d.doacao?._id !== idDoacao)
        );
        setDenunciaSelecionada(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const denunciasAgrupadas = denuncias.reduce((acc, denuncia) => {
    const id = denuncia.doacao?._id || "sem-doacao";
    if (!acc[id]) acc[id] = { doacao: denuncia.doacao, denuncias: [] };
    acc[id].denuncias.push(denuncia);
    return acc;
  }, {});

  useEffect(() => {
    document.body.style.overflow = denunciaSelecionada ? "hidden" : "auto";
  }, [denunciaSelecionada]);

  return (
    <div style={styles.container}>
      {/* Abas */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "receber" ? styles.abaAtiva : {}),
            }}
            onClick={() => navigate("/produtos")}
          >
            Receber
          </button>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "denuncias" ? styles.abaAtiva : {}),
            }}
            onClick={() => setAbaAtiva("denuncias")}
          >
            Denúncias
          </button>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "relatorios" ? styles.abaAtiva : {}),
            }}
            onClick={() => navigate("/relatorios")}
          >
            Relatórios
          </button>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "controle" ? styles.abaAtiva : {}),
            }}
            onClick={() => navigate("/controleUsuarios")}
          >
            Controle de Usuários
          </button>
        </div>
      </div>

      {/* Quadrado verde grande */}
      <div style={styles.quadradoGrande}>
        {Object.keys(denunciasAgrupadas).length === 0 ? (
          <div style={styles.textoAdmin}>Nenhuma denúncia encontrada.</div>
        ) : (
          Object.values(denunciasAgrupadas).map((grupo) => (
            <div
              key={grupo.doacao?._id || Math.random()}
              style={styles.quadradoPequeno}
              onClick={() => setDenunciaSelecionada(grupo)}
            >
              <div style={styles.nome}>
                {grupo.doacao?.nome || "Doação não encontrada"}
              </div>

              {grupo.denuncias.length > 1 && (
                <div style={styles.badge}>{grupo.denuncias.length}</div>
              )}

              <button
                style={styles.botaoResolver}
                onClick={(e) => {
                  e.stopPropagation();
                  resolverTodas(grupo.doacao?._id);
                }}
              >
                Resolver todos
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {denunciaSelecionada && (
        <div
          style={styles.modalOverlay}
          onClick={() => setDenunciaSelecionada(null)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitulo}>
              {denunciaSelecionada.doacao?.nome || "Doação não encontrada"}
            </h2>

            <div style={styles.modalConteudo}>
              {denunciaSelecionada.denuncias.map((d) => (
                <div key={d._id} style={styles.caixaDenuncia}>
                  <p style={styles.texto}>
                    <strong>Usuário:</strong> {d.usuario?.nome || "Desconhecido"}
                  </p>
                  <p style={styles.texto}>
                    <strong>Motivo:</strong> {d.motivo}
                  </p>
                  <p style={styles.texto}>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: d.status === "resolvida" ? "#2e7d32" : "#c62828",
                        fontWeight: "bold",
                      }}
                    >
                      {d.status}
                    </span>
                  </p>
                  {d.status !== "resolvida" && (
                    <button
                      style={styles.botaoIndividual}
                      onClick={() => resolverDenuncia(d._id)}
                    >
                      Resolver
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              style={styles.botaoResolverModal}
              onClick={() => resolverTodas(denunciaSelecionada.doacao?._id)}
            >
              Resolver todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------- ESTILOS -------------------
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  abasContainer: {
    width: "1200px",
    display: "flex",
    justifyContent: "flex-start",
  },
  abasEsquerda: { display: "flex", flexDirection: "row" },
  aba: {
    padding: "12px 30px",
    backgroundColor: "#88bd8a",
    border: "none",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    color: "#3b5534",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
    marginRight: "2px",
  },
  abaAtiva: { backgroundColor: "#6f9064", color: "#fff" },
  quadradoGrande: {
  backgroundColor: "#6f9064",
  borderRadius: "0 24px 24px 24px",
  padding: "30px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)", // 4 colunas
  columnGap: "4px", // espaço horizontal menor
  rowGap: "20px",   // espaço vertical um pouco maior
  width: "1200px",
  justifyItems: "center", // centraliza cada card na coluna
},
  quadradoPequeno: {
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    width: "230px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "15px 10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
    cursor: "pointer",
    position: "relative",
    gap: "10px", // espaço entre título e botão
  },
  nome: {
    fontWeight: "bold",
    color: "#3b5534",
    fontSize: "1.05rem",
    textAlign: "center",
    wordBreak: "break-word",
    margin: 0,
  },
  badge: {
    position: "absolute",
    top: "-12px",
    right: "-12px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "0.9rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  botaoResolver: {
    marginTop: "auto", // empurra para baixo e alinha
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 20px",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  textoAdmin: {
    color: "#fff",
    fontSize: "1.2rem",
    textAlign: "center",
    width: "100%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: "#C8E6C9",
    borderRadius: "16px",
    padding: "20px",
    width: "720px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  modalTitulo: {
    color: "#3b5534",
    fontWeight: "bold",
    fontSize: "1.4rem",
    textAlign: "center",
    marginBottom: "10px",
    wordBreak: "break-word",
  },
  modalConteudo: { display: "flex", flexDirection: "column", gap: "10px" },
  caixaDenuncia: {
    border: "2px solid #88bd8a",
    borderRadius: "10px",
    padding: "12px 15px",
    backgroundColor: "#E8F5E9",
    wordBreak: "break-word",
  },
  texto: { margin: "3px 0", overflowWrap: "break-word" },
  botaoIndividual: {
    marginTop: "6px",
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  botaoResolverModal: {
    marginTop: "10px",
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
};
