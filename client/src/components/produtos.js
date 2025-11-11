import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function Produtos() {
  const [abaAtiva, setAbaAtiva] = useState("receber");
  const [doacoes, setDoacoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

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
    const nomeMatch = item.nome?.toLowerCase().includes(pesquisa.toLowerCase());
    const filtroMatch = filtro
      ? item.nome?.toLowerCase().includes(filtro.toLowerCase())
      : true;
    return nomeMatch && filtroMatch;
  });

  return (
    <div style={styles.container}>
      {/* Abas superiores */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          {/* Usuário comum */}
          {user?.tipo !== "admin" && (
            <>
              <button
                style={{
                  ...styles.aba,
                  ...(abaAtiva === "receber" ? styles.abaAtiva : {}),
                }}
                onClick={() => setAbaAtiva("receber")}
              >
                Receber
              </button>

              <button
                style={{
                  ...styles.aba,
                  ...(abaAtiva === "doar" ? styles.abaAtiva : {}),
                }}
                onClick={() => navigate("/cadastroProduto")}
              >
                Doar
              </button>

              <button
                style={{
                  ...styles.aba,
                  ...(abaAtiva === "minhas" ? styles.abaAtiva : {}),
                }}
                onClick={() => navigate("/minhasDoacoes")}
              >
                Minhas Doações
              </button>

              {/* Barra de pesquisa e filtro */}
              <div style={styles.abaPesquisaFiltro}>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  style={styles.pesquisa}
                />
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  style={styles.filtro}
                >
                  <option value="">Sem filtro</option>
                  <option value="notebook">Notebook</option>
                  <option value="celular">Celular</option>
                  <option value="monitor">Monitor</option>
                  <option value="impressora">Impressora</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>
            </>
          )}

          {/* Admin */}
          {user?.tipo === "admin" && (
            <>
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
                onClick={() => navigate("/denuncias")}
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
            </>
          )}
        </div>
      </div>

      {/* Quadrado grande */}
      <div style={styles.quadradoGrande}>
        {abaAtiva === "receber" && (
          <>
            {doacoesFiltradas.length === 0 && (
              <div style={{ color: "#333", textAlign: "center", width: "100%" }}>
                Nenhuma doação encontrada.
              </div>
            )}
            {doacoesFiltradas.map((item) => (
              <div key={item._id || item.id} style={styles.quadradoPequeno}>
                <img
                  src={
                    item.fotos && item.fotos.length > 0
                      ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${item.fotos[0]}`
                      : "/Logo.png"
                  }
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

                {/* Botão excluir */}
                {(user?.tipo === "admin" ||
                  (item.usuario && item.usuario._id === user?._id)) && (
                  <button
                    style={styles.deleteButton}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Tem certeza que deseja deletar esta doação?"
                        )
                      )
                        return;

                      const url =
                        user?.tipo === "admin"
                          ? `${REACT_APP_YOUR_HOSTNAME}/doacao/${item._id}/admin`
                          : `${REACT_APP_YOUR_HOSTNAME}/doacao/${item._id}`;

                      const response = await fetch(url, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      });

                      if (response.ok) {
                        setDoacoes(doacoes.filter((d) => d._id !== item._id));
                        window.alert("Doação deletada com sucesso!");
                      } else {
                        const data = await response.json();
                        window.alert(data.message || "Erro ao deletar doação.");
                      }
                    }}
                    title="Excluir doação"
                  >
                    <FaTrash size={18} color="#3b5534" />
                  </button>
                )}

                {/* Botão editar */}
                {item.usuario && item.usuario._id === user?._id && (
                  <button
                    style={styles.iconButton}
                    onClick={() => navigate(`/editarDoacao/${item._id}`)}
                    title="Editar doação"
                  >
                    <FaPencilAlt size={18} color="#3b5534" />
                  </button>
                )}
              </div>
            ))}
          </>
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
  abaPesquisaFiltro: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#88bd8a",
    borderTopRightRadius: "16px",
    borderTopLeftRadius: "16px",
    padding: "0 18px",
    height: "54px",
    marginLeft: "2px",
    zIndex: 2,
  },
  pesquisa: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    marginRight: "10px",
  },
  filtro: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
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
    padding: "6px",
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
    padding: "6px",
    cursor: "pointer",
    zIndex: 11,
  },
};
