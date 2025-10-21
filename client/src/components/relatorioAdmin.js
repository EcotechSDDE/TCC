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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatoriosAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("todos");

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
      <div style={styles.pageContainer}>
        <p style={styles.loading}>Carregando relatórios...</p>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div style={styles.pageContainer}>
        <p style={styles.loading}>Nenhum dado disponível.</p>
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
        text: "Categorias Mais Doações",
        color: "#2ecc71",
        font: { size: 16, weight: "bold" },
      },
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Painel de Relatórios</h2>
        <p style={styles.subtitle}>
          Bem-vindo, <b>{user?.nome || "Administrador"}</b>
        </p>
      </div>

      {/* Filtro de período */}
      <div style={styles.filterContainer}>
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
  );
};

export default RelatoriosAdmin;

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    padding: "40px 60px",
    fontFamily: "'Poppins', sans-serif",
    marginTop: "32px",
    borderRadius: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2ecc71",
  },
  subtitle: {
    color: "#555",
    fontSize: "16px",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  select: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "25px 20px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  cardTitle: {
    color: "#2ecc71",
    fontSize: "16px",
    marginBottom: "8px",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    marginTop: "60px",
  },
};
