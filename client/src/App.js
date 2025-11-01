import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import UserList from "./components/userList";
import Edit from "./components/edit";
import Create from "./components/create";
import Login from "./components/login";
import Cadastro from "./components/cadastro";
import Produtos from "./components/produtos";
import CadastroProduto from "./components/cadastroProduto";
import DetalhesProduto from "./components/detalhesProduto";
import Perfil from "./components/perfil";
import Contato from "./components/contato";
import DenunciasAdmin from "./components/denunciaAdmin";
import { AuthContext } from "./AuthContext";
import RelatorioAdmin from "./components/relatorioAdmin";
import ControleUsuarios from "./components/controleUsuarios";
import MinhasDoacoes from "./components/minhasDoacoes";
import EditarDoacao from "./components/editarDoacao";

const App = () => {
  const { user } = useContext(AuthContext);

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
          <Route path="/perfil/:id" element={<Perfil />} />
          <Route path="/contato/:idDoacao" element={<Contato />} />
          <Route
            path="/denuncias"
            element={user?.tipo === "admin" ? <DenunciasAdmin /> : <Login />}
          />
          <Route
            path="/relatorios"
            element={user?.tipo === "admin" ? <RelatorioAdmin /> : <Login />}
          />
          <Route
            path="/controleUsuarios"
            element={user?.tipo === "admin" ? <ControleUsuarios /> : <Login />}
          />
          <Route path="/minhasDoacoes" element={<MinhasDoacoes />} />
          <Route path="/editarDoacao/:id" element={<EditarDoacao />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
