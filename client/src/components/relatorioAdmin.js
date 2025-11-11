import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Line, Pie, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RelatoriosAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("todos");
  const [abaAtiva, setAbaAtiva] = useState("relatorios");
  const navigate = useNavigate();
  const relatorioRef = useRef();

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

  // Função para gerar o PDF colorido com logo e data
  const handleSavePDF = async () => {
    const input = relatorioRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Cabeçalho do PDF
    const logoUrl = "/logoIcone.png";
    const nomeSistema = "EcoTech - Relatório do Sistema";
    const dataAtual = new Date().toLocaleString("pt-BR");

    // Inserir logo no topo
    try {
      pdf.addImage(logoUrl, "PNG", 15, 10, 20, 20);
    } catch {
      console.warn("Logo não encontrada, seguindo sem imagem.");
    }

    // Texto do cabeçalho
    pdf.setFontSize(14);
    pdf.text(nomeSistema, 40, 20);
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${dataAtual}`, 40, 27);

    // Espaço antes do conteúdo
    pdf.addImage(imgData, "PNG", 10, 40, pdfWidth - 20, pdfHeight - 20);

    // Nome do arquivo
    const nomeArquivo = `Relatorio_EcoTech_${new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-")}.pdf`;

    pdf.save(nomeArquivo);
  };

  if (loading)
    return (
      <div style={styles.container}>
        <div style={styles.quadradoGrande}>
          <p style={styles.textoAdmin}>Carregando relatórios...</p>
        </div>
      </div>
    );

  if (!relatorio)
    return (
      <div style={styles.container}>
        <div style={styles.quadradoGrande}>
          <p style={styles.textoAdmin}>Nenhum dado disponível.</p>
        </div>
      </div>
    );

  // Gráficos
  const dataCrescimento = {
    labels: relatorio.meses,
    datasets: [
      {
        label: "Usuários Cadastrados",
        data: relatorio.usuariosPorMes,
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46, 204, 113, 0.3)",
        tension: 0.4,
      },
      {
        label: "Doações Cadastradas",
        data: relatorio.doacoesPorMes,
        borderColor: "#1b5e20",
        backgroundColor: "rgba(27, 94, 32, 0.3)",
        tension: 0.4,
      },
    ],
  };

  const optionsCrescimento = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Crescimento de Usuários e Doações",
        font: { size: 20, weight: "bold" },
      },
    },
    maintainAspectRatio: false,
  };

  const dataUsuariosTipo = {
    labels: ["Admin", "Comum", "Bloqueado"],
    datasets: [
      {
        data: [
          relatorio.usuariosAdmin,
          relatorio.usuariosComum,
          relatorio.usuariosBloqueados,
        ],
        backgroundColor: ["#2e7d32", "#66bb6a", "#a5d6a7"],
        borderWidth: 1,
      },
    ],
  };

  const optionsUsuariosTipo = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Usuários por Tipo",
        font: { size: 20, weight: "bold" },
      },
    },
    maintainAspectRatio: false,
  };

  const dataIdades = {
    labels: relatorio.faixaEtaria.labels,
    datasets: [
      {
        label: "Quantidade de Usuários",
        data: relatorio.faixaEtaria.valores,
        backgroundColor: "#66bb6a",
      },
    ],
  };

  const optionsIdades = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Faixa Etária dos Usuários",
        font: { size: 20, weight: "bold" },
      },
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={styles.container}>
      {/* Abas */}
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

      {/* Quadrado principal */}
      <div style={styles.quadradoGrande} ref={relatorioRef}>
        {/* Botão de salvar PDF */}
        <button style={styles.botaoImprimir} onClick={handleSavePDF}>
          💾 Salvar Relatório (PDF)
        </button>

        <p style={styles.subtitulo}>
          Bem-vindo, <b>{user?.nome || "Administrador"}</b>
        </p>

        <div style={styles.filtroContainer}>
          <label style={styles.label}>Filtrar por período:</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={styles.select}
          >
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="todos">Todos</option>
          </select>
        </div>

        {/* Cards */}
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Usuários Cadastrados</h3>
            <p style={styles.cardValue}>{relatorio.totalUsuarios}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Usuários Ativos</h3>
            <p style={styles.cardValue}>{relatorio.usuariosAtivos}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Usuários Bloqueados</h3>
            <p style={styles.cardValue}>{relatorio.usuariosBloqueados}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Doações Ativas</h3>
            <p style={styles.cardValue}>{relatorio.totalDoacoes}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={styles.chartsRow}>
          <div style={styles.chartColumn}>
            <div style={styles.chartSmall}>
              <Line data={dataCrescimento} options={optionsCrescimento} />
            </div>
            <div style={styles.chartSmall}>
              <Bar data={dataIdades} options={optionsIdades} />
            </div>
          </div>
          <div style={styles.chartSmall}>
            <Pie data={dataUsuariosTipo} options={optionsUsuariosTipo} />
          </div>
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
    position: "relative",
  },
  botaoImprimir: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2e7d32",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  tituloSecao: { fontSize: "28px", fontWeight: "bold", marginBottom: "10px" },
  subtitulo: { fontSize: "20px", marginBottom: "30px" },
  filtroContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  label: { fontWeight: "bold" },
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
  cardValue: { fontSize: "1.8rem", color: "#2e3b2d", fontWeight: "bold" },
  cardSub: { fontSize: "0.8rem", color: "#3b5534", marginTop: "5px" },
  chartsRow: { display: "flex", gap: "20px", justifyContent: "space-between" },
  chartColumn: { display: "flex", flexDirection: "column", gap: "20px" },
  chartSmall: {
    width: "570px",
    backgroundColor: "#C8E6C9",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
  },
  textoAdmin: {
    color: "#fff",
    fontSize: "1.2rem",
    textAlign: "center",
    width: "100%",
  },
};
