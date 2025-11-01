import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MapaGoogle from "./mapaGoogle";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function EditarDoacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    nome: "",
    modelo: "",
    marca: "",
    descricao: "",
    especificacao: "",
    potencia: "",
    tamanho: "",
    observacao: "",
    tipo: "",
    tipoMaterial: "",
    status: "",
    cor: "",
    endereco: "",
    fotos: [], // Novas fotos selecionadas
  });

  const [erro, setErro] = useState("");

  // Carregar dados da doação
  useEffect(() => {
    async function carregarDoacao() {
      try {
        const resp = await axios.get(`${REACT_APP_YOUR_HOSTNAME}/doacao/${id}`);
        const data = resp.data;
        setForm({
          nome: data.nome || "",
          modelo: data.modelo || "",
          marca: data.marca || "",
          descricao: data.descricao || "",
          especificacao: data.especificacao || "",
          potencia: data.potencia || "",
          tamanho: data.tamanho || "",
          observacao: data.observacao || "",
          tipo: data.tipo || "",
          tipoMaterial: data.tipoMaterial || "",
          status: data.status || "",
          cor: data.cor || "",
          endereco: data.endereco || "",
          fotos: [], // Nenhuma nova foto por padrão
        });
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar doação.");
      }
    }
    carregarDoacao();
  }, [id]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function validarCampos() {
    if (!form.nome.trim()) {
      window.alert("O campo Nome é obrigatório.");
      return false;
    }
    if (!form.marca.trim()) {
      window.alert("O campo Marca é obrigatório.");
      return false;
    }
    if (!form.tipo.trim()) {
      window.alert("O campo Tipo é obrigatório.");
      return false;
    }
    if (!form.tipoMaterial.trim()) {
      window.alert("O campo Tipo de Material é obrigatório.");
      return false;
    }
    if (!form.status.trim()) {
      window.alert("O campo Status é obrigatório.");
      return false;
    }
    if (form.fotos.length > 0 && form.fotos.length < 3) {
      window.alert("Selecione pelo menos 3 fotos se for atualizar as imagens.");
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validarCampos()) return;

    const formData = new FormData();

    // Apenas adicionar fotos se houver novas selecionadas
    if (form.fotos.length > 0) {
      form.fotos.forEach((file) => formData.append("fotos", file));
    }

    // Adicionar outros campos
    [
      "nome",
      "modelo",
      "marca",
      "descricao",
      "especificacao",
      "potencia",
      "tamanho",
      "observacao",
      "tipo",
      "tipoMaterial",
      "status",
      "cor",
      "endereco",
    ].forEach((key) => formData.append(key, form[key]));

    try {
      await axios.put(`${REACT_APP_YOUR_HOSTNAME}/doacao/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Doação atualizada com sucesso!");
      navigate("/minhasDoacoes");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar doação.");
    }
  }

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={styles.container}>
      {/* Aba superior */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button style={{ ...styles.aba, ...styles.abaAtiva }} disabled>
            Editar Doação
          </button>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ ...styles.quadradoGrande, paddingBottom: 80 }}>
        <form
          onSubmit={onSubmit}
          encType="multipart/form-data"
          style={{ width: "100%" }}
        >
          <div style={styles.formContainer}>
            {/* Coluna esquerda */}
            <div style={styles.formColumn}>
              <label style={styles.label}>Nome</label>
              <input
                type="text"
                placeholder="Digite o nome do dispositivo"
                value={form.nome}
                onChange={(e) => updateForm({ nome: e.target.value })}
                maxLength={80}
                style={styles.input}
              />

              <label style={styles.label}>Modelo</label>
              <input
                type="text"
                placeholder="Digite o modelo do dispositivo"
                value={form.modelo}
                onChange={(e) => updateForm({ modelo: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Marca</label>
              <select
                value={form.marca}
                onChange={(e) => updateForm({ marca: e.target.value })}
                style={styles.input}
              >
                <option value="">Selecione a marca</option>
                {[
                  "Acer",
                  "AMD",
                  "Apple",
                  "Asus",
                  "Dell",
                  "HP",
                  "Intel",
                  "Lenovo",
                  "LG",
                  "Logitech",
                  "Microsoft",
                  "Motorola",
                  "Multilaser",
                  "Nvidia",
                  "Philips",
                  "Positivo",
                  "Redragon",
                  "Samsung",
                  "Sony",
                  "Outro",
                ].map((marca) => (
                  <option key={marca}>{marca}</option>
                ))}
              </select>

              <label style={styles.label}>Descrição</label>
              <input
                type="text"
                placeholder="Descreva o dispositivo"
                value={form.descricao}
                onChange={(e) => updateForm({ descricao: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Especificação</label>
              <input
                type="text"
                placeholder="Digite as especificações técnicas"
                value={form.especificacao}
                onChange={(e) => updateForm({ especificacao: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Potência</label>
              <select
                value={form.potencia}
                onChange={(e) => updateForm({ potencia: e.target.value })}
                style={styles.input}
              >
                <option value="">Selecione a faixa de potência</option>
                {[
                  "Até 5W",
                  "5–20W",
                  "20–50W",
                  "50–200W",
                  "200–500W",
                  "500–1000W",
                  "1000W+",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <label style={styles.label}>Tamanho</label>
              <input
                type="text"
                placeholder="Digite o tamanho do dispositivo"
                value={form.tamanho}
                onChange={(e) => updateForm({ tamanho: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Localização</label>
            </div>

            {/* Coluna direita */}
            <div style={styles.formColumn}>
              <label style={styles.label}>Observação</label>
              <input
                type="text"
                placeholder="Digite alguma observação se tiver"
                value={form.observacao}
                onChange={(e) => updateForm({ observacao: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => updateForm({ tipo: e.target.value })}
                style={styles.input}
              >
                <option value="">Selecione o tipo</option>
                {[
                  "Caixa De Som",
                  "Camera",
                  "Computador",
                  "Consoles",
                  "Fone De Ouvido",
                  "Impressora",
                  "Monitor",
                  "Notebook",
                  "Smartphone",
                  "Tablet",
                  "Televisão",
                  "Peças/Componentes",
                  "Outro",
                ].map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>

              <label style={styles.label}>Tipo Material</label>
              <select
                value={form.tipoMaterial}
                onChange={(e) => updateForm({ tipoMaterial: e.target.value })}
                style={styles.input}
              >
                <option value="">Selecione o tipo de material</option>
                {["Plástico", "Metal", "Borracha", "Misto", "Outro"].map(
                  (m) => (
                    <option key={m}>{m}</option>
                  )
                )}
              </select>

              <label style={styles.label}>Status</label>
              <select
                value={form.status}
                onChange={(e) => updateForm({ status: e.target.value })}
                style={styles.input}
              >
                <option value="">Selecione o status</option>
                {[
                  "Novo",
                  "Usado mas em bom estado",
                  "Usado mas com defeito",
                  "Quebrado (para descarte/peças)",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <label style={styles.label}>Cor</label>
              <input
                type="text"
                placeholder="Digite a cor do dispositivo"
                value={form.cor}
                onChange={(e) => updateForm({ cor: e.target.value })}
                style={styles.input}
              />

              <label style={styles.label}>Fotos (opcional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  updateForm({ fotos: Array.from(e.target.files) })
                }
                style={styles.input}
              />
              {form.fotos.length > 0 && (
                <div
                  style={{
                    color: form.fotos.length < 3 ? "red" : "#3b5534",
                    fontSize: "0.95rem",
                    marginTop: 4,
                  }}
                >
                  {form.fotos.length} foto(s) selecionada(s).{" "}
                  {form.fotos.length < 3
                    ? "Selecione pelo menos 3 fotos."
                    : "OK!"}
                </div>
              )}
            </div>
          </div>

          {/* Mapa */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 30,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 1000,
                maxWidth: "100%",
                boxSizing: "border-box",
                borderRadius: 20,
                overflow: "clip",
                position: "relative",
                border: "2px solid rgb(116, 158, 117)",
              }}
            >
              <div style={{ width: "100%", height: 300 }}>
                <MapaGoogle
                  onPick={(coords) =>
                    updateForm({ endereco: `${coords.lat},${coords.lng}` })
                  }
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              gap: 12,
            }}
          >
            <button type="submit" style={styles.button}>
              Salvar alterações
            </button>
            <button
              type="button"
              style={styles.buttonCancel}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
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
  abasContainer: {
    width: 1200,
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 0,
  },
  abasEsquerda: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  },
  aba: {
    padding: "14px 38px 18px 38px",
    backgroundColor: "#88bd8a",
    border: "none",
    borderRadius: "16px 16px 0 0",
    color: "#3b5534",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
  },
  abaAtiva: { backgroundColor: "#6f9064", color: "#fff" },
  quadradoGrande: {
    backgroundColor: "#6f9064",
    borderRadius: "0 24px 24px 24px",
    padding: "50px 40px 40px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 40,
    width: 1200,
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: { display: "flex", gap: 40, justifyContent: "space-between" },
  formColumn: { display: "flex", flexDirection: "column", gap: 15, flex: 1 },
  label: { fontSize: "1.1rem", color: "#000000" },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#C8E6C9",
    color: "#3b5534",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "10px 24px",
    backgroundColor: "#eee",
    color: "#333",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
