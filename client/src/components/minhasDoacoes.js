import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function MinhasDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchDoacoes() {
      try {
        if (!token) {
          setErro("Você precisa estar logado para ver suas doações.");
          return;
        }

        const response = await axios.get(`${REACT_APP_YOUR_HOSTNAME}/doacao/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoacoes(response.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) setErro("Usuário não autenticado");
        else setErro("Erro ao carregar doações");
      }
    }

    fetchDoacoes();
  }, [token]);

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja deletar esta doação?")) return;

    try {
      await axios.delete(`${REACT_APP_YOUR_HOSTNAME}/doacao/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoacoes(doacoes.filter((d) => d._id !== id));
      alert("Doação deletada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar doação.");
    }
  }

  if (erro) return <p style={{ color: "red", textAlign: "center" }}>{erro}</p>;

  return (
    <div style={styles.container}>
      {/* Abas superiores */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button style={{ ...styles.aba }} onClick={() => navigate("/produtos")}>
            Receber
          </button>

          <button style={{ ...styles.aba }} onClick={() => navigate("/cadastroProduto")}>
            Doar
          </button>

          <button
            style={{ ...styles.aba, ...styles.abaAtiva }}
            onClick={() => navigate("/minhasDoacoes")}
          >
            Minhas Doações
          </button>
        </div>
      </div>

      {/* Quadrado grande */}
      <div style={styles.quadradoGrande}>
        {doacoes.length === 0 ? (
          <div style={{ color: "#fff", textAlign: "center", width: "100%" }}>
            Você ainda não fez nenhuma doação.
          </div>
        ) : (
          doacoes.map((item) => (
            <div key={item._id} style={styles.quadradoPequeno}>
              <img
                src={
                  item.fotos && item.fotos.length > 0
                    ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${item.fotos[0]}`
                    : "/Logo.png"
                }
                alt={item.nome}
                style={styles.imagem}
              />
              <div style={styles.nome}>
                {item.nome.length > 80 ? item.nome.slice(0, 80) + "..." : item.nome}
              </div>
              <button
                style={styles.contato}
                onClick={() => navigate(`/detalhesProduto/${item._id}`)}
              >
                Mostrar Mais
              </button>

              {/* Ícone de deletar */}
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(item._id)}
                title="Excluir doação"
              >
                <FaTrash size={14} color="#3b5534" />
              </button>

              {/* Ícone de editar */}
              <button
                style={styles.iconButton}
                onClick={() => navigate(`/editarDoacao/${item._id}`)}
                title="Editar doação"
              >
                <FaPencilAlt size={14} color="#3b5534" />
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
    width: "190px",
    height: "253px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
    margin: "0",
    justifyContent: "flex-start",
    position: "relative",
  },
  imagem: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
    marginTop: "10px",
  },
  nome: {
    fontWeight: "bold",
    color: "#3b5534",
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "12px",
    maxWidth: "160px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
    lineHeight: "1.2rem",
    minHeight: "2.4rem",
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
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "#eee",
    border: "none",
    borderRadius: "50%",
    padding: "6px 8px",
    cursor: "pointer",
    zIndex: 10,
  },
  iconButton: {
    position: "absolute",
    top: 8,
    left: 42,
    background: "#eee",
    border: "none",
    borderRadius: "50%",
    padding: "6px 8px",
    cursor: "pointer",
    zIndex: 11,
  },
};
