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

// Cập nhật Socket.io middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    socket.phoneNumber = decoded.phoneNumber;
    
    console.log(`🔌 Socket connected: ${decoded.id}, Role: ${decoded.role}`);
    next();
  } catch (error) {
    console.error('Socket JWT verification error:', error);
    next(new Error('Authentication failed'));
  }
});

// Socket events với role checking
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.userId} (${socket.userRole})`);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("message", async (data) => {
    try {
      // Lưu message vào database
      const message = new Message({
        from: data.from,
        to: data.to,
        message: data.message,
        timestamp: new Date()
      });
      
      await message.save();
      
      // Nếu là admin, có thể gửi broadcast message
      if (socket.userRole === 'admin' && data.broadcast) {
        io.emit("broadcast_message", {
          from: data.from,
          message: data.message,
          timestamp: new Date(),
          type: 'admin_broadcast'
        });
        console.log(`📢 Admin broadcast: ${data.message}`);
      } else {
        // Gửi message thường
        io.to(data.to).emit("message", data);
        console.log(`💬 Message from ${data.from} to ${data.to}`);
      }
    } catch (error) {
      console.error('Message handling error:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

// Add missing JWT login route
app.post('/api/auth/jwt-login', async (req, res) => {
  try {
    const { userId, userInfo } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: userId,
        userInfo: userInfo,
        timestamp: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token: token,
      user: userInfo 
    });
    
  } catch (error) {
    console.error('JWT login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add phone verification route
app.post('/api/phone/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }
    
    // Mock phone verification - replace with actual Zalo API call
    res.json({
      success: true,
      phoneNumber: '+84987654321', // Mock phone
      userInfo: { verified: true }
    });
    
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Phone verification failed' });
  }
});

// Thêm route xử lý Zalo phone token
app.post('/auth/verify-phone', async (req, res) => {
  try {
    const { token, secretKey } = req.body;
    
    if (!token || !secretKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token and secret key required' 
      });
    }

    // Decode Zalo phone token
    const phoneData = await decodeZaloPhoneToken(token, secretKey);
    
    if (!phoneData || !phoneData.number) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid phone token' 
      });
    }

    const phoneNumber = phoneData.number;
    
    // Kiểm tra admin phone number
    const ADMIN_PHONE = "0963332502";
    const role = phoneNumber === ADMIN_PHONE ? "admin" : "user";
    
    // Tạo JWT token
    const jwtPayload = {
      id: phoneData.id || `phone_${phoneNumber}`,
      phoneNumber: phoneNumber,
      role: role,
      platform: 'zalo',
      iat: Math.floor(Date.now() / 1000)
    };
    
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });
    
    console.log(`✅ Phone verified: ${phoneNumber}, Role: ${role}`);
    
    res.json({
      success: true,
      jwtToken: jwtToken,
      user: {
        id: jwtPayload.id,
        phoneNumber: phoneNumber,
        role: role
      }
    });
    
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Phone verification failed' 
    });
  }
});

// Hàm decode Zalo phone token
const decodeZaloPhoneToken = async (token, secretKey) => {
  try {
    const crypto = require('crypto');
    
    // Zalo sử dụng HMAC-SHA256 để encode phone token
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    
    return {
      id: decoded.id,
      number: decoded.number
    };
  } catch (error) {
    console.error('Token decode error:', error);
    
    // Fallback: gọi Zalo API để verify
    try {
      const response = await axios.get('https://graph.zalo.me/v2.0/me/info', {
        headers: {
          'access_token': token
        }
      });
      
      return {
        id: response.data.id,
        number: response.data.phone
      };
    } catch (apiError) {
      throw new Error('Cannot decode phone token');
    }
  }
};
