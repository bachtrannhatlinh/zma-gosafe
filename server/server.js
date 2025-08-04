require('dotenv').config({ path: './.env' });
// hoặc
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Protected API routes
app.get("/history", authMiddleware, async (req, res) => {
  const { from, to } = req.query;
  const messages = await Message.find({
    $or: [
      { from, to },
      { from: to, to: from }
    ]
  }).sort({ timestamp: 1 });
  res.json(messages);
});

// Endpoint để đổi Zalo token thành JWT
app.post("/auth/zalo", async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    // Verify Zalo token với Zalo API
    const zaloResponse = await axios.get(process.env.ENDPOINT, {
      headers: {
        'access_token': accessToken
      }
    });
    
    if (zaloResponse.data && zaloResponse.data.id) {
      // Tạo JWT token
      const jwtToken = jwt.sign(
        { 
          userId: zaloResponse.data.id,
          name: zaloResponse.data.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token: jwtToken, userInfo: zaloResponse.data });
    } else {
      res.status(401).json({ error: 'Invalid Zalo token' });
    }
  } catch (error) {
    console.error('Zalo auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Socket.io with JWT authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error('Authentication error'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Socket JWT error:', error.message);
        next(new Error('Authentication error'));
    }
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id, "User:", socket.user?.name);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", async (msg) => {
    const { from, to, message } = msg;
    await Message.create({ from, to, message });
    io.to(to).emit("receive-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
