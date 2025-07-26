// server.js (hoặc index.js)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Khai báo Schema tin nhắn
const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Socket.io xử lý
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", async (msg) => {
    const { from, to, message } = msg;

    // Lưu vào MongoDB
    await Message.create({ from, to, message });

    // Gửi tới client đích
    io.to(to).emit("receive-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// API để lấy lịch sử chat
app.get("/history", async (req, res) => {
  const { from, to } = req.query;

  const messages = await Message.find({
    $or: [
      { from, to },
      { from: to, to: from }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});