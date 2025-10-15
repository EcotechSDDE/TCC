const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user"); // rotas de usuário
const DoacaoRoutes = require("./routes/doacao"); // rotas de doação
const chatRoutes = require('./routes/chat'); // rotas de chat

const app = express();
const port = 5050;

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' }
});

// Map para manter status online
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // espera receber userId quando conectar
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user-status', Array.from(onlineUsers.keys()));
  });

  socket.on('leave', (userId) => {
    onlineUsers.delete(userId);
    io.emit('user-status', Array.from(onlineUsers.keys()));
  });

  socket.on('private-message', ({ chatId, message }) => {
    // envia para participantes conectados
    const recipientSocketId = onlineUsers.get(message.to);
    // broadcast para todos por enquanto
    io.to(socket.id).emit('message-sent', { chatId, message });
    if (recipientSocketId) io.to(recipientSocketId).emit('private-message', { chatId, message });
  });

  socket.on('disconnect', () => {
    // remove do mapa
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user-status', Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // servir arquivos estáticos
app.use(userRoutes); // rotas
app.use(DoacaoRoutes); // rotas de doação
app.use(chatRoutes); // rotas de chat

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
    server.listen(port, () => {
      console.log("🚀 Servidor rodando na porta: " + port);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error.message);
  });
