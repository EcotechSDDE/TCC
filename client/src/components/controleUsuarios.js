import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";
Modal.setAppElement("#root");

export default function ControleUsuarios() {
  const { token, user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [duracao, setDuracao] = useState("");
  const [unidade, setUnidade] = useState("horas");

  useEffect(() => {
    if (!token || user?.tipo !== "admin") return;

    async function fetchUsuarios() {
      try {
        const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        alert("Erro ao carregar usuários.");
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuarios();
  }, [token, user]);

  // 🔹 Deletar usuário
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

  // 🔹 Abre modal de bloqueio
  function abrirModal(usuario) {
    setUsuarioSelecionado(usuario);
    setDuracao("");
    setUnidade("horas");
    setModalOpen(true);
  }

  // 🔹 Fecha modal
  function fecharModal() {
    setModalOpen(false);
    setUsuarioSelecionado(null);
  }

  // 🔹 Confirmar bloqueio
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

  // 🔹 Desbloquear
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

  if (carregando) return <p style={styles.texto}>Carregando usuários...</p>;
  if (user?.tipo !== "admin") return <p style={styles.texto}>🚫 Acesso negado.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Controle de Usuários 👤</h2>

      {usuarios.length === 0 ? (
        <p style={styles.texto}>Nenhum usuário encontrado.</p>
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
  );
}

const styles = {
  container: {
    backgroundColor: "#6f9064", // verde-médio (igual login)
    color: "#fff",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    margin: "40px auto",
    maxWidth: "1000px",
  },
  titulo: {
    fontSize: "1.8rem",
    marginBottom: "25px",
    textAlign: "center",
    color: "#fff",
  },
  texto: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#fff",
    marginBottom: "20px",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#C8E6C9", // verde-claro
    color: "#333",
    borderRadius: "12px",
    overflow: "hidden",
  },
  cabecalho: {
    backgroundColor: "#3b5534", // verde escuro
    color: "#fff",
    textAlign: "left",
    padding: "12px",
  },
  linha: {
    borderBottom: "1px solid #ddd",
  },
  celula: {
    padding: "10px 12px",
    textAlign: "center",
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
    backgroundColor: "#3b5534", // verde escuro
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
  btnDesbloquear: {
    backgroundColor: "#C8E6C9", // verde claro
    color: "#3b5534",
    border: "1px solid #3b5534",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
  btnExcluir: {
    backgroundColor: "#fff",
    border: "2px solid #6f9064",
    color: "#3b5534",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
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
    transition: "0.2s",
  },
  btnCancelar: {
    backgroundColor: "#fff",
    color: "#3b5534",
    border: "2px solid #6f9064",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
};

// Estilo do modal
const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#C8E6C9", // verde claro (igual formulário login)
    padding: "30px",
    borderRadius: "16px",
    width: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    border: "none",
  },
};