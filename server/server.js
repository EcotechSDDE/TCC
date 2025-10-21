const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user"); // rotas de usuário
const DoacaoRoutes = require("./routes/doacao"); // rotas de doação
const DenunciaRoutes = require("./routes/denuncia"); // rotas de denúncia
const RelatorioRoutes = require("./routes/relatorio"); // rotas de relatório

const app = express();
const port = 5050;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // servir arquivos estáticos
app.use("/user", userRoutes); // rotas de usuário
app.use("/doacao", DoacaoRoutes); // rotas de doação
app.use("/denuncia", DenunciaRoutes); // rotas de denúncia
app.use("/relatorio", RelatorioRoutes); // rotas de relatório

// Rota de teste
app.get("/", (req, res) => {
  res.send("App is running");
});

// Conexão com o MongoDB Atlas via Mongoose
mongoose
  .connect("mongodb+srv://ecotechsdee:dlpiYMQQGi5sVm3E@cluster0.7mfl0lv.mongodb.net/usuarios?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(" Conectado ao MongoDB com Mongoose");
    app.listen(port, () => {
      console.log("🚀 Servidor rodando na porta: " + port);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error.message);
  });
