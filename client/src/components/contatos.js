import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../AuthContext";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";
const socket = io(REACT_APP_YOUR_HOSTNAME, { autoConnect: false });

// Remove lista de chats/contatos, chat é sempre único por doação
export default function Contatos() {
  const { token, user } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [reportMsgId, setReportMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Conecta socket ao entrar
  useEffect(() => {
    if (user && user._id) {
      socket.connect();
      socket.emit("join", user._id);
      socket.on("private-message", ({ chatId, message }) => {
        if (selectedChat && chatId === selectedChat._id) {
          setMessages(msgs => [...msgs, message]);
        }
      });
      return () => {
        socket.emit("leave", user._id);
        socket.disconnect();
      };
    }
  }, [user, selectedChat]);

  // Busca chat único por doação
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('user');
  const doacaoId = searchParams.get('doacao');

  useEffect(() => {
    if (userId && doacaoId && user && token) {
      fetch(`${process.env.REACT_APP_API_URL || REACT_APP_YOUR_HOSTNAME}/chat/by-donation/${doacaoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) {
            setSelectedChat(data);
            setMessages(data.messages || []);
            setBlocked(data.blocked || false);
            if (socket) {
              socket.emit('joinRoom', data._id);
            }
          }
        });
    }
  }, [userId, doacaoId, user, token]);

  // Envia mensagem
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || blocked) return;
    const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/chat/${selectedChat._id}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: input })
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(msgs => [...msgs, msg]);
      socket.emit("private-message", { chatId: selectedChat._id, message: { ...msg, to: selectedChat.participants.find(u => u._id !== user._id) } });
      setInput("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  // Denunciar mensagem ou chat
  async function reportMessage(messageId) {
    let reason = window.prompt("Descreva o motivo da denúncia:");
    if (!reason) return;
    await fetch(`${REACT_APP_YOUR_HOSTNAME}/chat/${selectedChat._id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messageId, reason })
    });
    alert("Denúncia enviada para análise do admin.");
    setReportMsgId(null);
  }

  // Admin bloqueia/desbloqueia chat
  async function toggleBlock() {
    const url = `${REACT_APP_YOUR_HOSTNAME}/chat/${selectedChat._id}/${blocked ? "unblock" : "block"}`;
    await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setBlocked(!blocked);
  }

  // UI (mantém apenas o chat, sem lista de contatos)
  return (
    <div style={{ display: "flex", height: "70vh", background: "#f6fff6", borderRadius: 24, boxShadow: "0 2px 10px #0002", margin: 40, overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {selectedChat ? (
          <>
            <div style={{ background: "#6f9064", color: "#fff", padding: 14, fontWeight: "bold", borderBottom: "2px solid #88bd8a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Chat com {selectedChat.participants.find(u => u._id !== user._id)?.nome}</span>
              {user.tipo === "admin" && (
                <button onClick={toggleBlock} style={{ background: blocked ? "#c62828" : "#388e3c", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: "bold", cursor: "pointer" }}>{blocked ? "Desbloquear" : "Bloquear"}</button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 18, background: "#f6fff6" }}>
              {messages.map((msg, i) => (
                <div key={msg._id || i} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === user._id ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{ background: msg.sender === user._id ? "#88bd8a" : "#fff", color: "#333", borderRadius: 12, padding: "8px 14px", maxWidth: 320, boxShadow: "0 1px 4px #0001", position: "relative" }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {blocked && <div style={{ color: "#c62828", fontWeight: "bold", marginTop: 16 }}>Este chat está bloqueado pelo administrador.</div>}
            </div>
            <form onSubmit={sendMessage} style={{ display: "flex", padding: 12, borderTop: "2px solid #88bd8a", background: "#f6fff6", alignItems: "center" }}>
              <input value={input} onChange={e => setInput(e.target.value)} disabled={blocked} style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 10, fontSize: 16, marginRight: 8 }} placeholder={blocked ? "Chat bloqueado" : "Digite sua mensagem..."} />
              <button type="submit" disabled={blocked || !input.trim()} style={{ background: "#6f9064", color: "#fff", border: "none", borderRadius: 8, padding: "0 18px", fontWeight: "bold", fontSize: 16, cursor: blocked ? "not-allowed" : "pointer" }}>Enviar</button>
            </form>
            {/* Botão de denunciar conversa no centro inferior */}
            <button
              style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translateX(-50%)', zIndex: 2, background: '#c62828', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
              onClick={() => setReportMsgId("chat")}
              disabled={selectedChat.reported}
            >
              {selectedChat.reported ? 'Chat já denunciado' : 'Denunciar conversa'}
            </button>
            {reportMsgId === "chat" && (
              <div style={{ background: "#fff3e0", border: "1px solid #ffb300", borderRadius: 8, padding: 12, margin: 12, position: 'absolute', left: 10, bottom: 60, zIndex: 3 }}>
                <span>Deseja denunciar esta conversa?</span>
                <button onClick={() => reportMessage(null)} style={{ marginLeft: 8, background: "#c62828", color: "#fff", border: "none", borderRadius: 6, padding: "2px 10px", fontSize: 13, cursor: "pointer" }}>Confirmar</button>
                <button onClick={() => setReportMsgId(null)} style={{ marginLeft: 8, background: "#ccc", color: "#333", border: "none", borderRadius: 6, padding: "2px 10px", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ color: "#c62828", textAlign: "center", marginTop: 80, fontSize: 20 }}>Não foi possível abrir o chat para esta doação.</div>
        )}
      </div>
    </div>
  );
}
