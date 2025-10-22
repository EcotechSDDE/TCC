import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function DenunciasAdmin() {
  const { token, user } = useContext(AuthContext);
  const [denuncias, setDenuncias] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("denuncias");
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
      .then((data) => setDenuncias(data))
      .catch((err) => console.error(err));
  }, [token, user, navigate]);

  async function resolverDenuncia(id) {
    try {
      const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/denuncia/${id}/resolver`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDenuncias((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: "resolvida" } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={styles.container}>
      {/* Abas superiores - mesmo padrão do produtos.js */}
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

      {/* Quadrado verde grande (igual produtos.js) */}
      <div style={styles.quadradoGrande}>
        {denuncias.length === 0 ? (
          <div style={styles.textoAdmin}>Nenhuma denúncia encontrada.</div>
        ) : (
          denuncias.map((d) => (
            <div key={d._id} style={styles.quadradoPequeno}>
              <div style={styles.nome}>
                {d.doacao?.nome || "Doação não encontrada"}
              </div>
              <div style={styles.detalhes}>
                <p><strong>Usuário:</strong> {d.usuario?.nome || "Desconhecido"}</p>
                <p><strong>Motivo:</strong> {d.motivo}</p>
                <p>
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
              </div>

              <button
                style={{
                  ...styles.contato,
                  backgroundColor:
                    d.status === "resolvida" ? "#9e9e9e" : "#3b5534",
                  cursor: d.status === "resolvida" ? "default" : "pointer",
                }}
                disabled={d.status === "resolvida"}
                onClick={() => resolverDenuncia(d._id)}
              >
                {d.status === "resolvida" ? "✅ Resolvida" : "Marcar como resolvida"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
    marginBottom: "0px",
  },
  abasEsquerda: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "0px",
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
    zIndex: 2,
  },
  abaAtiva: {
    backgroundColor: "#6f9064",
    color: "#fff",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    borderBottom: "none",
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
    marginTop: "0px",
  },
  quadradoPequeno: {
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    width: "230px",
    height: "270px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 15px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
    position: "relative",
  },
  nome: {
    fontWeight: "bold",
    color: "#3b5534",
    fontSize: "1.1rem",
    textAlign: "center",
    marginBottom: "10px",
  },
  detalhes: {
    color: "#2e3b2d",
    fontSize: "0.95rem",
    textAlign: "left",
    width: "100%",
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
    fontWeight: "bold",
  },
  textoAdmin: {
    color: "#fff",
    fontSize: "1.2rem",
    textAlign: "center",
    width: "100%",
  },
};
