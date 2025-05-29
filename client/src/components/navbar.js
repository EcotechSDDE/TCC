import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle"

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
    return (
        <div>
             <nav className="navbar navbar-expand-lg navbar-dark bg-success p-2">
                <div className="d-flex align-items-center">
                    <NavLink className="navbar-brand" to="/">
                        <img style={{ width: "50px", height: "auto" }} src="/Logo.png" alt="Logo Ecotech" />
                    </NavLink>
                    <span className="ms-3 fw-bold">
                        Sistema de Doações de Equipamentos Eletrônicos
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

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/create">
                                Cadastrar Usuários
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}