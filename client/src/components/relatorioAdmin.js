import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatoriosAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("todos");
  const [abaAtiva, setAbaAtiva] = useState("relatorios");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5050/relatorio", {
          headers: { Authorization: `Bearer ${token}` },
          params: { periodo },
        });
        setRelatorio(res.data);
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorio();
  }, [periodo, token]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.quadradoGrande}>
          <p style={styles.textoAdmin}>Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div style={styles.container}>
        <div style={styles.quadradoGrande}>
          <p style={styles.textoAdmin}>Nenhum dado disponível.</p>
        </div>
      </div>
    );
  }

  // Gráfico de categorias
  const dataCategorias = {
    labels: relatorio.categorias.map((cat) => cat._id),
    datasets: [
      {
        label: "Quantidade de Doações",
        data: relatorio.categorias.map((cat) => cat.count),
        backgroundColor: "rgba(46, 204, 113, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Categorias com Mais Doações",
        color: "#2e7d32",
        font: { size: 16, weight: "bold" },
      },
    },
  };

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
            onClick={() => setAbaAtiva("relatorios")}
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

      {/* Quadrado verde grande */}
      <div style={styles.quadradoGrande}>
        <h2 style={styles.tituloSecao}>📊 Painel de Relatórios</h2>
        <p style={styles.subtitulo}>
          Bem-vindo, <b>{user?.nome || "Administrador"}</b>
        </p>

        {/* Filtro */}
        <div style={styles.filtroContainer}>
          <label style={styles.label}>Filtrar por período:</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={styles.select}
          >
            <option value="todos">Todos</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
          </select>
        </div>

        {/* Cards de estatísticas */}
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Usuários Cadastrados</h3>
            <p style={styles.cardValue}>{relatorio.totalUsuarios}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Doações Ativas</h3>
            <p style={styles.cardValue}>{relatorio.totalDoacoes}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Doações Excluídas</h3>
            <p style={styles.cardValue}>{relatorio.totalDoacoesExcluidas}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Denúncias Recebidas</h3>
            <p style={styles.cardValue}>{relatorio.totalDenuncias}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div style={styles.chartContainer}>
          <Bar data={dataCategorias} options={options} />
        </div>
      </div>
    </div>
  );
};

export default RelatoriosAdmin;

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
    padding: "40px 50px",
    display: "flex",
    flexDirection: "column",
    width: "1200px",
    minHeight: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginTop: "0px",
    color: "#fff",
  },
  tituloSecao: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitulo: {
    fontSize: "16px",
    marginBottom: "30px",
  },
  filtroContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  label: {
    fontWeight: "bold",
  },
  select: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#C8E6C9",
    color: "#2e3b2d",
    fontWeight: "bold",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    marginBottom: "40px",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    width: "250px",
    height: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
  },
  cardTitle: {
    color: "#3b5534",
    fontSize: "1rem",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: "1.8rem",
    color: "#2e3b2d",
    fontWeight: "bold",
  },
  chartContainer: {
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
  },
  textoAdmin: {
    color: "#fff",
    fontSize: "1.2rem",
    textAlign: "center",
    width: "100%",
  },
};
