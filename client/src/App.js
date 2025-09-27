import React from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import UserList from "./components/userList"
import Edit from "./components/edit"
import Create from "./components/create"
import Login from "./components/login"
import Cadastro from "./components/cadastro"
import Produtos from "./components/produtos"
import CadastroProduto from "./components/cadastroProduto"
import DetalhesProduto from "./components/detalhesProduto"

const App = () => {

    // Espaçamento padrão para todas as telas
    const mainStyle = { paddingTop: "40px", paddingBottom: "40px" };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-fill container my-4" style={mainStyle}>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/list" element={<UserList />} />
                    <Route path="/edit/:id" element={<Edit />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/cadastroProduto" element={<CadastroProduto />} />
                    <Route path="/detalhesProduto/:id" element={<DetalhesProduto />} />
                </Routes>
            </main>
            <Footer /> 
        </div>
    )
}

export default App