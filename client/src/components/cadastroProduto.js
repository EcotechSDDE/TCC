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

  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "fotos") {
        for (let i = 0; i < value.length; i++) {
          formData.append("fotos", value[i]);
        }
      } else {
        formData.append(key, value);
      }
    });

    const token = localStorage.getItem("token"); // pega o token salvo
    if (!token) {
      window.alert("Você precisa estar logado para cadastrar uma doação.");
      navigate("/");
      return;
    }
    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao/add`, { 
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = `Erro ao cadastrar: ${response.statusText}`;
      window.alert(message);
      return;
    }

    navigate("/produtos");
  }

  return (
    <div style={styles.container}>
      {/* Abas superiores conectadas */}
      <div style={styles.abasContainer}>
        <div style={styles.abasEsquerda}>
          <button style={styles.aba} onClick={() => navigate("/produtos")}>
            Receber
          </button>
          <button style={{ ...styles.aba, ...styles.abaAtiva }} disabled>
            Doar
          </button>
        </div>
      </div>

      <div style={styles.quadradoGrande}>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!form.fotos || form.fotos.length < 3) {
                window.alert('Selecione pelo menos 3 fotos da doação.');
                return;
              }
              onSubmit(e);
            }}
            style={{
              ...styles.form,
              background: "none",
              boxShadow: "none",
              width: "100%",
              marginBottom: 0,
            }}
            encType="multipart/form-data"
          >
            <div style={styles.formContainer}>
              {/* Coluna Esquerda */}
              <div style={styles.formColumn}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome do dispositivo"
                  value={form.nome}
                  onChange={(e) => updateForm({ nome: e.target.value })}
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
                  <option>Samsung</option>
                  <option>LG</option>
                  <option>Dell</option>
                  <option>HP</option>
                  <option>Lenovo</option>
                  <option>Apple</option>
                  <option>Asus</option>
                  <option>Acer</option>
                  <option>Motorola</option>
                  <option>Positivo</option>
                  <option>Multilaser</option>
                  <option>Philips</option>
                  <option>Sony</option>
                  <option>Outro</option>
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
                  onChange={(e) =>
                    updateForm({ especificacao: e.target.value })
                  }
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
                  <option>Até 50W</option>
                  <option>50–200W</option>
                  <option>200–500W</option>
                  <option>500–1000W</option>
                  <option>1000W+</option>
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

              {/* Coluna Direita */}
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
                  <option>Computador</option>
                  <option>Notebook</option>
                  <option>Smartphone</option>
                  <option>Tablet</option>
                  <option>Impressora</option>
                  <option>Monitor</option>
                  <option>Televisão</option>
                  <option>Caixa de Som</option>
                  <option>Roteador</option>
                  <option>Consoles</option>
                  <option>Peças/Componentes</option>
                  <option>Outro</option>
                </select>

                <label style={styles.label}>Tipo Material</label>
                <select
                  value={form.tipoMaterial}
                  onChange={(e) => updateForm({ tipoMaterial: e.target.value })}
                  style={styles.input}
                  required
                >
                  <option value="">Selecione o tipo de material</option>
                  <option>Plástico</option>
                  <option>Metal</option>
                  <option>Vidro</option>
                  <option>Madeira</option>
                  <option>Composto</option>
                  <option>Borracha</option>
                  <option>Misto</option>
                  <option>Outro</option>
                </select>

                <label style={styles.label}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm({ status: e.target.value })}
                  style={styles.input}
                  required
                >
                  <option value="">Selecione o status</option>
                  <option>Novo</option>
                  <option>Usado mas em bom estado</option>
                  <option>Usado mas com defeito</option>
                  <option>Quebrado (para descarte/peças)</option>
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
                  onChange={(e) => updateForm({ fotos: e.target.files })}
                  style={styles.input}
                />
                {form.fotos && form.fotos.length > 0 && (
                  <div style={{ color: form.fotos.length < 3 ? 'red' : '#3b5534', fontSize: '0.95rem', marginTop: 4 }}>
                    {form.fotos.length} foto(s) selecionada(s). {form.fotos.length < 3 ? 'Selecione pelo menos 3 fotos.' : 'OK!'}
                  </div>
                )}
              </div>
            </div>

            {/* Mapa centralizado, maior, abaixo das colunas */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 10px 0" }}>
              <div style={{ width: "1000px", height: "400px" }}>
                <MapaGoogle
                  onPick={(coords) =>
                    updateForm({ endereco: `${coords.lat},${coords.lng}` })
                  }
                />
              </div>
            </div>

            {/* Botão centralizado abaixo do mapa, com menos espaço acima */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-80px",
              }}
            >
              <button type="submit" style={styles.button}>
                Cadastrar Doação
              </button>
            </div>
          </form>
        </div>
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
    backgroundColor: "#6f9064",
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
    backgroundColor: "#88bd8a",
    color: "#3b5534",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    borderBottom: "none",
  },
  abaPesquisaFiltro: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#C8E6C9",
    borderTopRightRadius: "16px",
    borderTopLeftRadius: "16px",
    padding: "0 18px",
    height: "54px",
    marginLeft: "2px",
    zIndex: 2,
  },
  quadradoGrande: {
    backgroundColor: "#88bd8a",
    borderRadius: "0 24px 24px 24px",
    padding: "50px 40px 40px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    width: "1200px",
    minHeight: "320px",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginTop: "0px",
  },
  form: {
    backgroundColor: "#6f9064",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "400px",
    marginBottom: "35px",
  },
  label: {
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#C8E6C9",
    color: "#3b5534",
    fontSize: "1.3rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
};
