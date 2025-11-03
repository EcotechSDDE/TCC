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
  const [motivo, setMotivo] = useState("");

  async function fetchUsuarios() {
    try {
      const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await res.json();

      const agora = new Date();
      data = data.map((u) => {
        if (u.bloqueado && u.bloqueadoUntil) {
          const bloqueadoData = new Date(u.bloqueadoUntil);
          if (bloqueadoData <= agora) {
            return {
              ...u,
              bloqueado: false,
              bloqueadoUntil: null,
              motivoBloqueio: null,
            };
          }
        }
        return u;
      });

      setUsuarios(data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    if (user?.tipo !== "admin") {
      navigate("/produtos");
      return;
    }

    fetchUsuarios();

    const interval = setInterval(() => {
      fetchUsuarios();
    }, 30000);

    return () => clearInterval(interval);
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
    setMotivo("");
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setUsuarioSelecionado(null);
  }

  async function confirmarBloqueio() {
    if (
      unidade !== "indefinido" &&
      (!duracao || isNaN(duracao) || duracao <= 0)
    ) {
      alert("Digite uma duração válida.");
      return;
    }

    if (!motivo || motivo.trim() === "") {
      alert("Informe o motivo do bloqueio.");
      return;
    }

    try {
      // ✅ Alteração principal: enviar "motivo" em vez de "motivoBloqueio"
      const body =
        unidade === "indefinido"
          ? { duracaoHoras: null, indefinido: true, motivo: motivo }
          : { duracao, unidade, motivo: motivo };

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
              ? {
                  ...u,
                  bloqueado: true,
                  bloqueadoUntil: data.bloqueadoUntil,
                  motivoBloqueio: motivo,
                }
              : u
          )
        );
        fecharModal();
        alert("Usuário bloqueado com sucesso!");
      } else {
        alert("Erro ao bloquear usuário.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDesbloquear(id) {
    try {
      const res = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/user/${id}/bloquear`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setUsuarios(
          usuarios.map((u) =>
            u._id === id
              ? {
                  ...u,
                  bloqueado: false,
                  bloqueadoUntil: null,
                  motivoBloqueio: null,
                }
              : u
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

  if (carregando)
    return <p style={styles.textoAdmin}>Carregando usuários...</p>;
  if (user?.tipo !== "admin")
    return <p style={styles.textoAdmin}>🚫 Acesso negado.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.abasContainer}>
        <button style={styles.aba} onClick={() => navigate("/produtos")}>
          Produtos
        </button>
        <button style={styles.aba} onClick={() => navigate("/denuncias")}>
          Denúncias
        </button>
        <button style={styles.aba} onClick={() => navigate("/relatorios")}>
          Relatórios
        </button>
        <button style={{ ...styles.aba, ...styles.abaAtiva }}>
          Controle de Usuários
        </button>
      </div>

      <div style={styles.quadradoGrande}>
        {usuarios.length === 0 ? (
          <div style={styles.textoAdmin}>Nenhum usuário encontrado.</div>
        ) : (
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th style={styles.thCentralizado}>Nome</th>
                <th style={styles.thCentralizado}>Email</th>
                <th style={styles.thCentralizado}>Tipo</th>
                <th style={styles.thCentralizado}>Status</th>
                <th style={styles.thCentralizado}>Bloqueado até</th>
                <th style={styles.thCentralizado}>Motivo</th>
                <th style={styles.thCentralizado}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => {
                const bloqueadoData = u.bloqueadoUntil
                  ? new Date(u.bloqueadoUntil)
                  : null;
                return (
                  <tr
                    key={u._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#e8f0eb" : "#d9e4dc",
                    }}
                  >
                    <td style={styles.tdCentralizado}>{u.nome}</td>
                    <td style={styles.tdCentralizado}>{u.email}</td>
                    <td style={styles.tdCentralizado}>{u.tipo}</td>
                    <td style={styles.tdCentralizado}>
                      {u.bloqueado ? (
                        <span style={styles.statusBloqueado}>Bloqueado</span>
                      ) : (
                        <span style={styles.statusAtivo}>Ativo</span>
                      )}
                    </td>
                    <td style={styles.tdCentralizado}>
                      {bloqueadoData ? (
                        <>
                          <div>{bloqueadoData.toLocaleDateString("pt-BR")}</div>
                          <div style={{ fontSize: "0.9em" }}>
                            {bloqueadoData.toLocaleTimeString("pt-BR")}
                          </div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={styles.tdCentralizado}>
                      {u.motivoBloqueio || "-"}
                    </td>
                    <td style={styles.acoes}>
                      {u.tipo !== "admin" ? (
                        <div style={styles.colunaBotoes}>
                          <button
                            style={styles.btnAcao}
                            onClick={() =>
                              u.bloqueado
                                ? handleDesbloquear(u._id)
                                : abrirModal(u)
                            }
                          >
                            {u.bloqueado ? "Desbloquear" : "Bloquear"}
                          </button>
                          <button
                            style={styles.btnAcao}
                            onClick={() => handleDelete(u._id)}
                          >
                            Excluir
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <Modal
          isOpen={modalOpen}
          onRequestClose={fecharModal}
          style={modalStyle}
          contentLabel="Bloquear Usuário"
        >
          <h2 style={styles.modalTitulo}>
            Bloquear {usuarioSelecionado?.nome || ""}
          </h2>
          <p style={{ textAlign: "center", marginBottom: "15px" }}>
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
              <option value="horas">Horas</option>
              <option value="dias">Dias</option>
              <option value="indefinido">Indefinido</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Motivo do bloqueio"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            style={styles.inputMotivoQuadrado}
          />

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
    marginTop: "40px",
  },
  abasContainer: { display: "flex", width: "1200px", marginBottom: "0" },
  aba: {
    padding: "14px 38px",
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
    padding: "60px",
    width: "1200px",
    minHeight: "450px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  textoAdmin: { color: "#fff", textAlign: "center", fontSize: "1.1rem" },
  tabela: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 15px",
    backgroundColor: "#C8E6C9",
    borderRadius: "10px",
    overflow: "hidden",
  },
  thCentralizado: {
    textAlign: "center",
    padding: "15px 10px",
    fontSize: "1.05rem",
    color: "#2e7d32",
  },
  tdCentralizado: { textAlign: "center", padding: "12px 10px" },
  acoes: { textAlign: "center", padding: "18px 12px" },
  colunaBotoes: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  statusAtivo: { color: "#2e7d32", fontWeight: "bold" },
  statusBloqueado: { color: "#b71c1c", fontWeight: "bold" },
  btnAcao: {
    backgroundColor: "#4a7c4a",
    color: "#fff",
    border: "none",
    padding: "10px 0",
    borderRadius: "8px",
    width: "120px",
    height: "40px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
  },
  modalTitulo: { textAlign: "center", color: "#3b5534", marginBottom: "15px" },
  modalInputs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "80px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  select: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  inputMotivoQuadrado: {
    width: "100%",
    height: "80px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  modalBotoes: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",
  },
  btnConfirmar: {
    backgroundColor: "#4a7c4a",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  btnCancelar: {
    backgroundColor: "#6ca86c",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

const modalStyle = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#C8E6C9",
    padding: "35px",
    paddingBottom: "80px",
    borderRadius: "20px",
    width: "600px",
    height: "fit-content",
    boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
    border: "none",
  },
};