import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    cpfCnpj: "",
    senha: "",
    confirmarSenha: "",
    imagem: null,
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // 🔹 Função para validar senha forte
  function validateSenhaForte(senha) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;
    return regex.test(senha);
  }

  async function onSubmit(e) {
    e.preventDefault();

    // 🔹 Validação de senha
    if (form.senha !== form.confirmarSenha) {
      alert("Senhas não coincidem. Tente novamente.");
      return;
    }

    if (
      !form.nome ||
      !form.email ||
      !form.telefone ||
      !form.dataNascimento ||
      !form.cpfCnpj ||
      !form.senha
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // 🔹 Validações individuais
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validateTelefone = (telefone) =>
      telefone.replace(/\D/g, "").length === 11;
    const validateNome = (nome) => nome.trim().split(" ").length > 1;

    if (!validateEmail(form.email)) return alert("Email inválido!");
    if (!validateTelefone(form.telefone)) return alert("Telefone inválido!");
    if (!validateNome(form.nome)) return alert("Digite o nome completo!");

    // 🔹 Nova validação de senha forte
    if (!validateSenhaForte(form.senha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres e conter letras maiúsculas, minúsculas, números e símbolos."
      );
      return;
    }

    try {
      // 🔹 Monta o corpo da requisição
      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("email", form.email);
      formData.append("telefone", form.telefone);
      formData.append("dataNascimento", form.dataNascimento);
      formData.append("cpfCnpj", form.cpfCnpj);
      formData.append("senha", form.senha);
      if (form.imagem) formData.append("imagem", form.imagem);

      // 🔹 Faz o cadastro
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/add`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const msg = await response.text();
        alert("Erro ao cadastrar: " + msg);
        return;
      }

      const result = await response.json();

      // 🔹 Login automático após cadastro
      if (result.token) {
        login(result.token, result.usuario); // salva token e usuário no contexto
        navigate("/produtos"); // redireciona para produtos
      } else {
        alert(
          "Cadastro realizado, mas não foi possível logar automaticamente."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Tente novamente mais tarde.");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EcoTech</h1>
      <h2 style={styles.subtitle}>
        Crie seu perfil para doar ou receber equipamentos
      </h2>

      <div style={styles.formContainer}>
        <form
          onSubmit={onSubmit}
          style={styles.form}
          encType="multipart/form-data"
        >
          <div style={{ display: "flex", gap: "40px", width: "100%" }}>
            <div style={styles.formColumn}>
              <label style={styles.label}>Nome</label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={form.nome}
                onChange={(e) => updateForm({ nome: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>Telefone</label>
              <InputMask
                mask="(99) 99999-9999"
                placeholder="Digite seu telefone"
                value={form.telefone}
                onChange={(e) => updateForm({ telefone: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>Data de Nascimento</label>
              <input
                type="date"
                value={form.dataNascimento}
                onChange={(e) => updateForm({ dataNascimento: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formColumn}>
              <label style={styles.label}>CPF/CNPJ</label>
              <InputMask
                mask={
                  form.cpfCnpj.replace(/\D/g, "").length > 11
                    ? "99.999.999/9999-99"
                    : "999.999.999-99"
                }
                placeholder="Digite seu CPF ou CNPJ"
                value={form.cpfCnpj}
                onChange={(e) => updateForm({ cpfCnpj: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>Senha</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={form.senha}
                  onChange={(e) => updateForm({ senha: e.target.value })}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>

              <label style={styles.label}>Confirmar Senha</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={form.confirmarSenha}
                  onChange={(e) =>
                    updateForm({ confirmarSenha: e.target.value })
                  }
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? "🔓" : "🔒"}
                </button>
              </div>

              <label style={styles.label}>Imagem de Perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateForm({ imagem: e.target.files[0] })}
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Criar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#6f9064",
    height: "78vh",
    width: "60%",
    maxWidth: "900px",
    margin: "30px auto 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    overflow: "hidden",
    borderRadius: "12px",
  },
  title: { fontSize: "2rem", marginBottom: "5px" },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "20px",
    textAlign: "center",
    maxWidth: "500px",
  },
  form: {
    backgroundColor: "#C8E6C9",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    width: "580px",
    transform: "scale(0.9)",
  },
  label: { fontSize: "1rem", color: "#333" },
  input: {
    padding: "8px 40px 8px 10px",
    fontSize: "0.95rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px",
    backgroundColor: "#3b5534",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  formContainer: { display: "flex", justifyContent: "center", width: "100%" },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    flex: 1,
  },
  eyeButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    opacity: 0.7,
    border: "none",
    background: "transparent",
  },
  passwordContainer: { position: "relative", width: "100%" },
};
