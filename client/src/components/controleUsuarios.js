import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";
Modal.setAppElement("#root");

export default function ControleUsuarios() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [duracao, setDuracao] = useState("");
  const [unidade, setUnidade] = useState("horas");

  useEffect(() => {
    if (!token) return;
    if (user?.tipo !== "admin") {
      navigate("/produtos");
      return;
    }

    async function fetchUsuarios() {
      try {
        const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuarios();
  }, [token, user, navigate]);

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u._id !== id));
        alert("Usuário excluído com sucesso!");
      } else {
        alert("Erro ao excluir usuário.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function abrirModal(usuario) {
    setUsuarioSelecionado(usuario);
    setDuracao("");
    setUnidade("horas");
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setUsuarioSelecionado(null);
  }

  async function confirmarBloqueio() {
    if (unidade !== "indefinido" && (!duracao || isNaN(duracao) || duracao <= 0)) {
      alert("Digite uma duração válida.");
      return;
    }

    try {
      const body =
        unidade === "indefinido"
          ? { duracaoHoras: null, indefinido: true }
          : { duracao, unidade };

      const res = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/user/${usuarioSelecionado._id}/tempo`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUsuarios(
          usuarios.map((u) =>
            u._id === usuarioSelecionado._id
              ? { ...u, bloqueado: true, bloqueadoUntil: data.bloqueadoUntil }
              : u
          )
        );
        fecharModal();
        alert(
          unidade === "indefinido"
            ? "Usuário bloqueado indefinidamente."
            : `Usuário bloqueado por ${duracao} ${unidade}.`
        );
      } else {
        alert("Erro ao bloquear usuário.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDesbloquear(id) {
    try {
      const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/${id}/bloquear`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsuarios(
          usuarios.map((u) =>
            u._id === id ? { ...u, bloqueado: false, bloqueadoUntil: null } : u
          )
        );
        alert("Usuário desbloqueado!");
      } else {
        alert("Erro ao desbloquear usuário.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (carregando) return <p style={styles.textoAdmin}>Carregando usuários...</p>;
  if (user?.tipo !== "admin") return <p style={styles.textoAdmin}>🚫 Acesso negado.</p>;

  return (
    <div style={styles.container}>
      {/* 🔹 Abas superiores - mesmo padrão do denunciaAdmin.js */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button
            style={styles.aba}
            onClick={() => navigate("/aprodutos")}
          >
            Produtos
          </button>

          <button
            style={styles.aba}
            onClick={() => navigate("/denuncias")}
          >
            Denúncias
          </button>

          <button
            style={styles.aba}
            onClick={() => navigate("/relatorios")}
          >
            Relatórios
          </button>

          <button style={{ ...styles.aba, ...styles.abaAtiva }}>
            Controle de Usuários
          </button>
        </div>
      </div>

      {/* 🔹 Quadrado verde grande (padrão) */}
      <div style={styles.quadradoGrande}>
        <h2 style={styles.titulo}>Controle de Usuários 👤</h2>

        {usuarios.length === 0 ? (
          <div style={styles.textoAdmin}>Nenhum usuário encontrado.</div>
        ) : (
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Bloqueado até</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr
                  key={u._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#dfe6e1" : "#c6d2c8",
                  }}
                >
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.tipo}</td>
                  <td>
                    {u.bloqueado ? (
                      <span style={styles.statusBloqueado}>Bloqueado</span>
                    ) : (
                      <span style={styles.statusAtivo}>Ativo</span>
                    )}
                  </td>
                  <td>
                    {u.bloqueadoUntil
                      ? new Date(u.bloqueadoUntil).toLocaleString("pt-BR")
                      : "-"}
                  </td>
                  <td style={styles.acoes}>
                    {u.tipo !== "admin" && (
                      <>
                        <button
                          style={u.bloqueado ? styles.btnDesbloquear : styles.btnBloquear}
                          onClick={() =>
                            u.bloqueado ? handleDesbloquear(u._id) : abrirModal(u)
                          }
                        >
                          {u.bloqueado ? "Desbloquear" : "Bloquear"}
                        </button>

                        <button
                          style={styles.btnExcluir}
                          onClick={() => handleDelete(u._id)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔹 Modal */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={fecharModal}
          style={modalStyle}
          contentLabel="Bloquear Usuário"
        >
          <h2 style={styles.modalTitulo}>
            Bloquear {usuarioSelecionado?.nome || ""}
          </h2>
          <p style={{ textAlign: "center", marginBottom: "10px" }}>
            Escolha o tempo de bloqueio:
          </p>

          <div style={styles.modalInputs}>
            {unidade !== "indefinido" && (
              <input
                type="number"
                placeholder="0"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                style={styles.input}
              />
            )}

            <select
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              style={styles.select}
            >
              <option value="segundos">Segundos</option>
              <option value="minutos">Minutos</option>
              <option value="horas">Horas</option>
              <option value="dias">Dias</option>
              <option value="indefinido">Indefinido</option>
            </select>
          </div>

          <div style={styles.modalBotoes}>
            <button style={styles.btnConfirmar} onClick={confirmarBloqueio}>
              Confirmar
            </button>
            <button style={styles.btnCancelar} onClick={fecharModal}>
              Cancelar
            </button>
          </div>
        </Modal>
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
  },
  aba: {
    padding: "14px 38px 18px 38px",
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
  abaAtiva: {
    backgroundColor: "#6f9064",
    color: "#fff",
  },
  quadradoGrande: {
    backgroundColor: "#6f9064",
    borderRadius: "0 24px 24px 24px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    width: "1200px",
    minHeight: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  titulo: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "1.8rem",
  },
  textoAdmin: {
    color: "#fff",
    textAlign: "center",
    fontSize: "1.1rem",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#C8E6C9",
    color: "#333",
    borderRadius: "12px",
    overflow: "hidden",
  },
  acoes: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  statusAtivo: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  statusBloqueado: {
    color: "#b71c1c",
    fontWeight: "bold",
  },
  btnBloquear: {
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnDesbloquear: {
    backgroundColor: "#C8E6C9",
    color: "#3b5534",
    border: "1px solid #3b5534",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnExcluir: {
    backgroundColor: "#fff",
    border: "2px solid #6f9064",
    color: "#3b5534",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalTitulo: {
    textAlign: "center",
    color: "#3b5534",
    marginBottom: "15px",
  },
  modalInputs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    width: "60px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalBotoes: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  btnConfirmar: {
    backgroundColor: "#3b5534",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnCancelar: {
    backgroundColor: "#fff",
    color: "#3b5534",
    border: "2px solid #6f9064",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#C8E6C9",
    padding: "30px",
    borderRadius: "16px",
    width: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    border: "none",
  },
};
