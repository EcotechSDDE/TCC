import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function Contato() {
  const { idDoacao } = useParams();
  const { token } = useContext(AuthContext);
  const [doacao, setDoacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); 
  const nomeContato = user?.nome || "Usuário";

  useEffect(() => {
    async function fetchDoacao() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/doacao/${idDoacao}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error("Erro ao buscar doação");
        const data = await response.json();

        // Garantir que a propriedade 'usuario' exista
        if (!data.usuario) throw new Error("Usuário da doação não encontrado");

        setDoacao(data);
      } catch (error) {
        window.alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoacao();
  }, [idDoacao, token]);

  if (loading) return <div style={styles.loading}>Carregando dados do doador...</div>;
  if (!doacao) return <div style={styles.loading}>Doação não encontrada.</div>;

  const usuario = doacao.usuario;
  const fotoPerfil = usuario?.imagem ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${usuario.imagem}` : "/Logo.png";

  const enviarEmail = () => {
  if (!usuario?.email) return;
  const assunto = `Contato sobre a doação ${doacao.nome}`;
  const mensagem = `Olá, meu nome é ${nomeContato} e estou entrando em contato pelo site da Ecotech devido à doação "${doacao.nome}". Gostaria de mais informações.`;

  
  window.location.href = `mailto:${usuario.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
};

  const enviarWhatsApp = () => {
  if (!usuario?.telefone) return;
  const numero = usuario.telefone.replace(/\D/g, "");
  const mensagem = `Olá, meu nome é ${nomeContato} e estou entrando em contato pelo site da Ecotech devido à doação "${doacao.nome}". Gostaria de mais informações.`;

  
  window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`, "_blank");
};

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Dados do Doador</h2>
      <div style={styles.card}>
        <img src={fotoPerfil} alt="Foto do doador" style={styles.foto} />
        <div style={styles.info}>
          <div style={styles.nome}>{usuario?.nome || "Sem nome"}</div>
          <div style={styles.linha}>
            <span style={styles.label}>Email:</span>
            <span style={styles.valor}>{usuario?.email || "Não informado"}</span>
            <button style={styles.botao} onClick={enviarEmail}>✉️</button>
          </div>
          <div style={styles.linha}>
            <span style={styles.label}>Telefone:</span>
            <span style={styles.valor}>{usuario?.telefone || "Não informado"}</span>
            <button style={styles.botao} onClick={enviarWhatsApp}>📱</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "60px auto",
    padding: 40,
    background: "#f6fff6",
    borderRadius: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  titulo: {
    color: "#3b5534",
    fontSize: "2rem",
    marginBottom: 20
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    background: "#C8E6C9",
    padding: 40,
    borderRadius: 24,
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  foto: {
    width: 180,
    height: 180,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #88bd8a",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1
  },
  nome: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#3b5534"
  },
  linha: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  label: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#3b5534"
  },
  valor: {
    color: "#3b5534",
    flex: 1,
    wordBreak: "break-word",
    fontSize: "1.1rem"
  },
  botao: {
    padding: "10px 16px",
    background: "#6f9064",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "1.2rem"
  },
  loading: {
    color: "#3b5534",
    textAlign: "center",
    marginTop: 40
  }
};
