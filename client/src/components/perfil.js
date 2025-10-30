import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import InputMask from "react-input-mask";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function Perfil() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    imagem: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setForm({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            senha: "",
            confirmarSenha: "",
            imagem: null,
          });
          setPreview(
            data.imagem
              ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${data.imagem}`
              : "/Logo.png"
          );
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
    fetchUser();
  }, [token]);

  function handleEdit() {
    setEditMode(true);
  }

  function handleCancel() {
    setEditMode(false);
    setForm({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      senha: "",
      confirmarSenha: "",
      imagem: null,
    });
    setPreview(
      user.imagem
        ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${user.imagem}`
        : "/Logo.png"
    );
    setShowPassword(false);
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "imagem" && files && files[0]) {
      setForm((f) => ({ ...f, imagem: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  const validateSenhaForte = (senha) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;
    return regex.test(senha);
  };

  async function handleSave(e) {
    e.preventDefault();

    if (!window.confirm("Tem certeza que deseja salvar as alterações do perfil?"))
      return;

    if (!form.nome.trim()) return alert("Nome é obrigatório!");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return alert("Email inválido!");
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone))
      return alert("Telefone inválido!");

    if (form.senha) {
      if (!validateSenhaForte(form.senha)) {
        return alert(
          "A nova senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos."
        );
      }
      if (form.senha !== form.confirmarSenha) {
        return alert("As senhas não coincidem!");
      }
    }

    try {
      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("email", form.email);
      formData.append("telefone", form.telefone);
      if (form.senha) formData.append("senha", form.senha);
      if (form.imagem) formData.append("imagem", form.imagem);

      const response = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/user/update/${user._id}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        setEditMode(false);
        setPreview(
          updated.imagem
            ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${updated.imagem}?t=${Date.now()}`
            : "/Logo.png"
        );
        alert("Perfil atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita."
      )
    )
      return;

    try {
      const response = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/user/${user._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Conta deletada com sucesso!");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar conta: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      alert("Erro ao deletar conta. Tente novamente.");
    }
  }

  if (!user)
    return (
      <div style={{ color: "#3b5534", textAlign: "center", marginTop: 40 }}>
        Carregando perfil...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        position: "relative",
        background: "#f6fff6",
        borderRadius: 24,
        boxShadow: "0 2px 10px #0002",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <img
          src={preview}
          alt="Foto de perfil"
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 2px 10px #0002",
            border: "4px solid #88bd8a",
          }}
        />

        {!editMode ? (
          <>
            <div
              style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3b5534" }}
            >
              {user.nome}
            </div>
            <div style={{ color: "#3b5534" }}>{user.email}</div>
            <div style={{ color: "#3b5534" }}>{user.telefone}</div>
          </>
        ) : (
          <form
            onSubmit={handleSave}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Nome"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Email"
              required
            />
            <InputMask
              mask="(99) 99999-9999"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Telefone"
              required
            />
            <div style={{ width: "100%", position: "relative" }}>
              <input
                name="senha"
                type={showPassword ? "text" : "password"}
                value={form.senha}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Digite sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={eyeButtonStyle}
              >
                {showPassword ? "🔓" : "🔒"}
              </button>
            </div>
            <input
              name="confirmarSenha"
              type="password"
              value={form.confirmarSenha}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Confirme a nova senha"
            />
            <input
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ marginTop: 8 }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", width: "100%" }}>
              <button type="submit" style={buttonStyle}>
                Salvar
              </button>
              <button
                type="button"
                style={buttonStyle}
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {!editMode && (
        <button
          onClick={handleEdit}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            background: "#6f9064",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 56,
            height: 56,
            fontSize: 28,
            boxShadow: "0 2px 10px #0002",
            cursor: "pointer",
          }}
          title="Editar perfil"
        >
          ✎
        </button>
      )}

      {!editMode && (
        <button
          onClick={handleDelete}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            background: "#c62828",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 56,
            height: 56,
            fontSize: 22,
            boxShadow: "0 2px 10px #0002",
            cursor: "pointer",
          }}
          title="Deletar conta"
        >
          🗑️
        </button>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 18px",
  background: "#6f9064",
  color: "#fff",
  fontSize: "1.1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const eyeButtonStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  width: 24,
  height: 24,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 16,
  opacity: 0.7,
};
