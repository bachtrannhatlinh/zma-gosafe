const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("chat message", ({ from, to, message }) => {
    io.to(to).emit("chat message", { from, message });
    // 👉 TODO: Lưu vào MongoDB
  });
});

server.listen(5000, () => console.log("Server running"));
