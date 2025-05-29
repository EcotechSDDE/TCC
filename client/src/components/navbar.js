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
             <nav className="navbar navbar-expand-lg navbar-dark p-1" style={{ backgroundColor: '#3b5534' }}>
                <div className="d-flex align-items-center">
                    <NavLink className="navbar-brand" to="/">
                        <img style={{ width: "50px", height: "auto" }} src="/Logo.png" alt="Logo Ecotech" />
                    </NavLink>
                    <span className="ms-3 fw-bold" style={{ color: "white" }}>
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
            </nav>
        </div>
    );
}