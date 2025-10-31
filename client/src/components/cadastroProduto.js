import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapaGoogle from "./mapaGoogle";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function CadastroProduto() {
  const [form, setForm] = useState({
    nome: "",
    modelo: "",
    marca: "",
    descricao: "",
    especificacao: "",
    potencia: "",
    tamanho: "",
    fotos: [],
    observacao: "",
    tipo: "",
    tipoMaterial: "",
    status: "",
    cor: "",
    endereco: "",
  });

  const [abaAtiva, setAbaAtiva] = useState("doar");
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "fotos") {
        value.forEach((file) => formData.append("fotos", file));
      } else {
        formData.append(key, value);
      }
    });

    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Você precisa estar logado para cadastrar uma doação.");
      navigate("/");
      return;
    }

    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao/add`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      window.alert(`Erro ao cadastrar: ${response.statusText}`);
      return;
    }

    navigate("/minhasDoacoes");
  }

  return (
    <div style={styles.container}>
      {/* Abas superiores */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "receber" ? styles.abaAtiva : {}),
            }}
            onClick={() => {
              setAbaAtiva("receber");
              navigate("/produtos");
            }}
          >
            Receber
          </button>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "doar" ? styles.abaAtiva : {}),
            }}
            disabled
          >
            Doar
          </button>
          <button
            style={{
              ...styles.aba,
              ...(abaAtiva === "minhas" ? styles.abaAtiva : {}),
            }}
            onClick={() => {
              setAbaAtiva("minhas");
              navigate("/minhasDoacoes");
            }}
          >
            Minhas Doações
          </button>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ ...styles.quadradoGrande, paddingBottom: "80px" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.fotos || form.fotos.length < 3) {
              window.alert("Selecione pelo menos 3 fotos da doação.");
              return;
            }
            onSubmit(e);
          }}
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
                onChange={(e) => {
                  if (e.target.value.length <= 80)
                    updateForm({ nome: e.target.value });
                }}
                maxLength={80}
                style={styles.input}
                required
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
                required
              >
                <option value="">Selecione a marca</option>
                {[
                  "Samsung",
                  "LG",
                  "Dell",
                  "HP",
                  "Lenovo",
                  "Apple",
                  "Asus",
                  "Acer",
                  "Motorola",
                  "Positivo",
                  "Multilaser",
                  "Philips",
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
                required
              >
                <option value="">Selecione a faixa de potência</option>
                {["Até 50W", "50–200W", "200–500W", "500–1000W", "1000W+"].map(
                  (p) => (
                    <option key={p}>{p}</option>
                  )
                )}
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
                required
              >
                <option value="">Selecione o tipo</option>
                {[
                  "Computador",
                  "Notebook",
                  "Smartphone",
                  "Tablet",
                  "Impressora",
                  "Monitor",
                  "Televisão",
                  "Caixa de Som",
                  "Roteador",
                  "Consoles",
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
                required
              >
                <option value="">Selecione o tipo de material</option>
                {[
                  "Plástico",
                  "Metal",
                  "Vidro",
                  "Madeira",
                  "Composto",
                  "Borracha",
                  "Misto",
                  "Outro",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <label style={styles.label}>Status</label>
              <select
                value={form.status}
                onChange={(e) => updateForm({ status: e.target.value })}
                style={styles.input}
                required
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

              <label style={styles.label}>Fotos</label>
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
                  {form.fotos.length < 3 ? "Selecione pelo menos 3 fotos." : "OK!"}
                </div>
              )}
            </div>
          </div>

          {/* Mapa — contêiner isolado sem padding externo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "1000px",
                maxWidth: "100%",
                boxSizing: "border-box",
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                border: "3px solid rgb(169, 214, 177)",
              }}
            >
              <div style={{ width: "100%", height: 400 }}>
                <MapaGoogle
                  onPick={(coords) =>
                    updateForm({ endereco: `${coords.lat},${coords.lng}` })
                  }
                />
              </div>
            </div>
          </div>

          {/* Botão */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <button type="submit" style={styles.button}>
              Cadastrar Doação
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
    padding: "50px 40px 40px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    width: "1200px",
    minHeight: "320px",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    gap: "40px",
    justifyContent: "space-between",
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    flex: 1,
  },
  label: { fontSize: "1rem", color: "#333" },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#C8E6C9",
    color: "#3b5534",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
