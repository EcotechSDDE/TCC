import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle"
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { user, logout, token } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const imgRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        imgRef.current &&
        !imgRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Não mostra ícone em login/cadastro
  const hideProfile = ["/", "/cadastro"].includes(location.pathname);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark p-1 fixed-top" style={{ backgroundColor: '#3b5534', zIndex: 1000 }}>
      <div className="d-flex align-items-center">
        <NavLink className="navbar-brand" to="/">
          <img style={{ width: "50px", height: "auto" }} src="/Logo.png" alt="Logo Ecotech" />
        </NavLink>
        <span className="ms-3 fw-bold" style={{ color: "white" }}>
          Sistema de Gerenciamento de Doação e Reaproveitamento de Equipamentos Eletrônicos
        </span>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      {!hideProfile && token && user && (
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <img
            ref={imgRef}
            src={user && user.imagem ? `http://localhost:5050/uploads/${user.imagem}` : "/LogoIcone.png"}
            alt="Perfil"
            style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer", marginRight: "12px" }}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div
              ref={menuRef}
              style={{
                position: "absolute", right: 0, top: 50, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002", zIndex: 10
              }}
            >
              <div style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }} onClick={() => { navigate(`/perfil/${user.id || user._id}`); setShowMenu(false); }}>
                Perfil
              </div>
              <div style={{ padding: 10, cursor: "pointer" }} onClick={() => { logout(); setShowMenu(false); navigate("/"); }}>
                Sair
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}