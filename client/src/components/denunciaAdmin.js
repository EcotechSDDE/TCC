import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function DenunciasAdmin() {
  const { token } = useContext(AuthContext);
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5050/denuncia", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDenuncias(data))
      .catch((err) => console.error(err));
  }, [token]);

  async function resolverDenuncia(id) {
    try {
      const res = await fetch(`http://localhost:5050/denuncia/${id}/resolver`, {
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
      <div style={styles.headerBox}>
        <h1 style={styles.title}>📣 Gerenciamento de Denúncias</h1>
        <p style={styles.subtitle}>
          Veja todas as denúncias feitas pelos usuários e marque como resolvidas.
        </p>
      </div>

      <div style={styles.contentBox}>
        {denuncias.length === 0 ? (
          <p style={styles.emptyText}>Nenhuma denúncia encontrada.</p>
        ) : (
          <ul style={styles.list}>
            {denuncias.map((d) => (
              <li key={d._id} style={styles.card}>
                <div style={styles.cardContent}>
                  <p>
                    <strong>Usuário:</strong> {d.usuario?.nome || "Desconhecido"}
                  </p>
                  {d.doacao && (
                    <p>
                      <strong>Doação:</strong> {d.doacao.nome}
                    </p>
                  )}
                  <p>
                    <strong>Motivo:</strong> {d.motivo}
                  </p>
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
                  disabled={d.status === "resolvida"}
                  onClick={() => resolverDenuncia(d._id)}
                  style={{
                    ...styles.button,
                    backgroundColor:
                      d.status === "resolvida" ? "#9e9e9e" : "#3b5534",
                    cursor: d.status === "resolvida" ? "default" : "pointer",
                  }}
                >
                  {d.status === "resolvida"
                    ? "✅ Resolvida"
                    : "Marcar como resolvida"}
                </button>
              </li>
            ))}
          </ul>
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
    width: "100%",
    minHeight: "80vh",
  },
  headerBox: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#3b5534",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    marginTop: "20px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#555",
  },
  contentBox: {
    backgroundColor: "#6f9064",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "1200px",
    minHeight: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardContent: {
    marginBottom: "10px",
    color: "#2e3b2d",
  },
  button: {
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 0",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background 0.2s ease",
  },
  emptyText: {
    color: "#fff",
    fontSize: "1.2rem",
  },
};
