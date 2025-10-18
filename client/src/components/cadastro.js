import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050'; // Seu back-end

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
        imagem: null
    });

    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);

    function updateForm(value) {
        setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (form.senha !== form.confirmarSenha) {
            window.alert("Senhas não coincidem. Tente novamente."); 
            return;
        }

        if (
            !form.nome ||
            !form.email ||
            !form.telefone ||
            !form.dataNascimento ||
            !form.cpfCnpj ||
            !form.senha ||
            !form.confirmarSenha
        ) {
            window.alert("Preencha todos os campos obrigatórios!");
            return;
        }

        function validateEmail(email) {
            return /\S+@\S+\.\S+/.test(email);
        }
        function validateTelefone(telefone) {
            return telefone.replace(/\D/g, "").length === 11;
        }
        function validateNome(nome) {
            return nome.trim().split(" ").length > 1;
        }

        if (!validateEmail(form.email)) {
            window.alert("Email inválido!");
            return;
        }
        if (!validateTelefone(form.telefone)) {
            window.alert("Telefone inválido!");
            return;
        }
        if (!validateNome(form.nome)) {
            window.alert("Digite o nome completo!");
            return;
        }

        const formData = new FormData();
        formData.append("nome", form.nome);
        formData.append("email", form.email);
        formData.append("telefone", form.telefone);
        formData.append("dataNascimento", form.dataNascimento);
        formData.append("cpfCnpj", form.cpfCnpj);
        formData.append("senha", form.senha);
        if (form.imagem) {
            formData.append("imagem", form.imagem);
        }

        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/add`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const message = `Erro ao cadastrar: ${response.statusText}`;
            window.alert(message);
            return;
        }

        // Cadastro OK, agora faça login automático:
        const loginResponse = await fetch(`${REACT_APP_YOUR_HOSTNAME}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, password: form.senha })
        });
        const loginResult = await loginResponse.json();

        if (loginResult.token) {
            // Use o AuthContext para salvar o token
            setToken(loginResult.token);
            navigate("/produtos");
        } else {
            window.alert("Cadastro realizado, mas não foi possível fazer login automático.");
            navigate("/produtos");
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
                  onChange={(e) =>
                    updateForm({ dataNascimento: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formColumn}>
                <label style={styles.label}>CPF/CNPJ</label>
                <InputMask
                  mask={
                    form.cpfCnpj.length > 14
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
  title: {
    fontSize: "2rem",
    marginBottom: "5px",
  },
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
  label: {
    fontSize: "1rem",
    color: "#333",
  },
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
  formContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
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
    transition: "opacity 0.2s ease",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIconHover: {
    opacity: 1,
  },
};