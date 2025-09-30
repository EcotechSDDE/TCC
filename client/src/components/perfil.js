import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import InputMask from "react-input-mask";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function Perfil() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "", imagem: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setForm({ nome: data.nome, email: data.email, telefone: data.telefone, senha: "", imagem: null });
        setPreview(data.imagem ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${data.imagem}` : "/Logo.png");
      }
    }
    fetchUser();
  }, [token]);

  function handleEdit() {
    setEditMode(true);
  }

  function handleCancel() {
    setEditMode(false);
    setForm({ nome: user.nome, email: user.email, telefone: user.telefone, senha: "", imagem: null });
    setPreview(user.imagem ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${user.imagem}` : "/Logo.png");
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "imagem" && files && files[0]) {
      setForm(f => ({ ...f, imagem: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!window.confirm("Tem certeza que deseja salvar as alterações do perfil?")) return;
    // Validação básica
    if (!form.nome.trim()) return window.alert("Nome é obrigatório!");
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return window.alert("Email inválido!");
    if (!form.telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) return window.alert("Telefone inválido!");
    if (form.senha && form.senha.length < 6) return window.alert("A senha deve ter pelo menos 6 caracteres!");
    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("email", form.email);
    formData.append("telefone", form.telefone);
    if (form.senha) formData.append("senha", form.senha);
    if (form.imagem) formData.append("imagem", form.imagem);
    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/update/${user._id}`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const updated = await response.json();
      setUser(updated);
      setEditMode(false);
      // Força recarregar a imagem para evitar cache
      setPreview(updated.imagem ? `${REACT_APP_YOUR_HOSTNAME}/uploads/${updated.imagem}?t=${Date.now()}` : "/Logo.png");
      window.alert("Perfil atualizado com sucesso!");
    } else {
      window.alert("Erro ao atualizar perfil");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.")) return;
    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/${user._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      window.alert("Conta deletada com sucesso!");
      window.location.href = "/";
    } else {
      window.alert("Erro ao deletar conta");
    }
  }

  if (!user) return <div style={{ color: "#3b5534", textAlign: "center", marginTop: 40 }}>Carregando perfil...</div>;

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", position: "relative", background: "#f6fff6", borderRadius: 24, boxShadow: "0 2px 10px #0002", padding: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <img
          src={preview}
          alt="Foto de perfil"
          style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 10px #0002", border: "4px solid #88bd8a" }}
        />
        {!editMode ? (
          <>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3b5534" }}>{user.nome}</div>
            <div style={{ color: "#3b5534" }}>{user.email}</div>
            <div style={{ color: "#3b5534" }}>{user.telefone}</div>
          </>
        ) : (
          <form onSubmit={handleSave} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <input name="nome" value={form.nome} onChange={handleChange} style={inputStyle} placeholder="Nome" required />
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="Email" required />
            <InputMask
              mask="(99) 99999-9999"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Telefone"
              required
            />
            <input name="senha" type="password" value={form.senha} onChange={handleChange} style={inputStyle} placeholder="Nova senha (mín. 6)" />
            <input name="imagem" type="file" accept="image/*" onChange={handleChange} style={{ marginTop: 8 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="submit" style={buttonStyle}>Salvar</button>
              <button type="button" style={{ ...buttonStyle, background: "#ccc", color: "#333" }} onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
      {/* Botão editar flutuante */}
      {!editMode && (
        <button
          onClick={handleEdit}
          style={{ position: "absolute", bottom: 24, right: 24, background: "#6f9064", color: "#fff", border: "none", borderRadius: "50%", width: 56, height: 56, fontSize: 28, boxShadow: "0 2px 10px #0002", cursor: "pointer" }}
          title="Editar perfil"
        >✎</button>
      )}
      {/* Botão deletar conta */}
      {!editMode && (
        <button
          onClick={handleDelete}
          style={{ position: "absolute", bottom: 24, left: 24, background: "#c62828", color: "#fff", border: "none", borderRadius: "50%", width: 56, height: 56, fontSize: 22, boxShadow: "0 2px 10px #0002", cursor: "pointer" }}
          title="Deletar conta"
        >&#128465;</button>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "100%"
};
const buttonStyle = {
  padding: "10px 18px",
  background: "#6f9064",
  color: "#fff",
  fontSize: "1.1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};