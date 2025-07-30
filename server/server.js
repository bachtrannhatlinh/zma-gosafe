const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const Message = require("./models/Message");
require("dotenv").config();

const PORT = 5000; // <-- Thêm dòng này thay cho dòng 21 cũ

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'https://zalo.me', 
      'https://h5.zalo.me', 
      'https://h5.zdn.vn',
      'https://zdn.vn',
      'https://localhost:3000',
      'https://zma-gosafe.zalo.me'
    ],
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gosafe-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id, 'from:', socket.handshake.headers.origin);

  socket.on('user-online', (userData) => {
    console.log('👤 User going online:', userData);
    onlineUsers.set(socket.id, {
      userId: userData.userId,
      userName: userData.userName,
      userPhone: userData.userPhone,
      socketId: socket.id
    });
    
    // Broadcast online users list
    const usersList = Array.from(onlineUsers.values());
    io.emit('users-online', usersList);
    console.log('📡 Broadcasting online users:', usersList.length);
  });

  socket.on('send-message', async (messageData) => {
    try {
      // Save message to database
      const message = new Message({
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        senderPhone: messageData.senderPhone,
        receiverId: messageData.receiverId,
        content: messageData.content,
        messageType: messageData.messageType || 'text'
      });
      
      await message.save();

      // Send to receiver if online
      const receiverSocket = Array.from(onlineUsers.values())
        .find(user => user.userId === messageData.receiverId);
      
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('receive-message', {
          ...message.toObject(),
          timestamp: message.timestamp
        });
      }

      // Confirm to sender
      socket.emit('message-sent', {
        success: true,
        messageId: message._id,
        timestamp: message.timestamp
      });

    } catch (error) {
      console.error('❌ Message error:', error);
      socket.emit('message-error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('users-online', Array.from(onlineUsers.values()));
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Chat API endpoints
app.get('/api/chat/messages/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    res.json({
      success: true,
      messages: messages.reverse(),
      page: parseInt(page),
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/chat/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simplified CORS for production
app.use(
  cors({
    origin: [
      "https://zalo.me",
      "https://h5.zalo.me", 
      "https://h5.zdn.vn",
      "https://zdn.vn",
      "https://zmp.zalo.me",
      "https://mini.zalo.me",
      "http://localhost:3000",
      "https://localhost:3000",
      "https://zma-gosafe.zalo.me",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Accept", 
      "Authorization",
      "User-Agent",
      "ngrok-skip-browser-warning",
      "X-Requested-With"
    ],
  })
);
app.use(express.json());

// Add preflight handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, ngrok-skip-browser-warning"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Thêm middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// Zalo App credentials - cần config trong .env
const ZALO_APP_ID = process.env.ZALO_APP_ID;
const ZALO_APP_SECRET = process.env.ZALO_APP_SECRET;

// Stringee configuration - sử dụng API_KEY và API_SECRET
const STRINGEE_API_KEY_SID = process.env.STRINGEE_API_KEY_SID;
const STRINGEE_API_KEY_SECRET = process.env.STRINGEE_API_KEY_SECRET;

// Health check endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "GoSafe Server đang chạy",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoints
app.get("/api/stringee/debug", (req, res) => {
  res.json({
    hasApiKey: !!STRINGEE_API_KEY_SID,
    hasApiSecret: !!STRINGEE_API_KEY_SECRET,
    apiKeyPrefix: STRINGEE_API_KEY_SID
      ? STRINGEE_API_KEY_SID.substring(0, 10) + "..."
      : "Not set",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/debug", (req, res) => {
  res.json({
    status: "OK",
    hasAppId: !!ZALO_APP_ID,
    hasAppSecret: !!ZALO_APP_SECRET,
    timestamp: new Date().toISOString(),
  });
});

// Stringee endpoints
app.get("/get-stringee-token", (req, res) => {
  const userId = req.query.userId;
  const token = jwt.sign(
    {
      jti: userId,
      iss: STRINGEE_API_KEY_SID,
      exp: Math.floor(Date.now() / 1000) + 3600,
      userId: userId,
    },
    STRINGEE_API_KEY_SECRET
  );
  res.json({ token });
});

app.get("/api/stringee/test", (req, res) => {
  res.json({
    success: true,
    message: "CORS test successful",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/stringee/token", async (req, res) => {
  console.log("🔑 Stringee token request received");

  try {
    if (!STRINGEE_API_KEY_SID || !STRINGEE_API_KEY_SECRET) {
      console.log("❌ Missing Stringee credentials");
      return res.json({
        success: false,
        error: "Stringee credentials not configured",
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 24 * 60 * 60;

    const payload = {
      jti: STRINGEE_API_KEY_SID + "-" + now,
      iss: STRINGEE_API_KEY_SID,
      exp: exp,
      userId: req.body.userId || "user_" + Date.now(),
    };

    const token = jwt.sign(payload, STRINGEE_API_KEY_SECRET, {
      algorithm: "HS256",
      header: {
        typ: "JWT",
        alg: "HS256",
        cty: "stringee-api;v=1",
      },
    });

    console.log("✅ Stringee token generated successfully");
    res.json({
      success: true,
      token: token,
      expires: exp,
    });
  } catch (error) {
    console.error("❌ Stringee token error:", error);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

// Test Stringee credentials endpoint
app.get("/api/test-stringee-creds", (req, res) => {
  res.json({
    hasApiKey: !!STRINGEE_API_KEY_SID,
    hasApiSecret: !!STRINGEE_API_KEY_SECRET,
    apiKeyLength: STRINGEE_API_KEY_SID ? STRINGEE_API_KEY_SID.length : 0,
    secretLength: STRINGEE_API_KEY_SECRET ? STRINGEE_API_KEY_SECRET.length : 0,
    timestamp: new Date().toISOString(),
  });
});

// SMS Brandname endpoint với Stringee SMS Gateway
app.post("/api/sms/send-brandname", async (req, res) => {
  console.log("📱 SMS Brandname request:", req.body);
  console.log("📋 Headers:", req.headers);

  try {
    const { phoneNumber, message, brandname } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required",
      });
    }

    // Kiểm tra Stringee credentials
    console.log("🔑 Checking credentials:", {
      hasApiKey: !!STRINGEE_API_KEY_SID,
      hasApiSecret: !!STRINGEE_API_KEY_SECRET,
      apiKeyPrefix: STRINGEE_API_KEY_SID
        ? STRINGEE_API_KEY_SID.substring(0, 10) + "..."
        : "Not set",
    });

    if (!STRINGEE_API_KEY_SID || !STRINGEE_API_KEY_SECRET) {
      console.log("❌ Missing Stringee credentials");
      return res.status(500).json({
        success: false,
        error: "Stringee credentials not configured",
      });
    }

    // Sử dụng Stringee SMS API với Basic Auth
    const authString = `${STRINGEE_API_KEY_SID}:${STRINGEE_API_KEY_SECRET}`;
    const authHeader = Buffer.from(authString).toString("base64");

    console.log("🔑 Auth debug:", {
      hasApiKey: !!STRINGEE_API_KEY_SID,
      hasApiSecret: !!STRINGEE_API_KEY_SECRET,
      authStringLength: authString.length,
      authHeaderLength: authHeader.length,
    });

    const smsResponse = await fetch("https://api.stringee.com/v1/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        sms: [
          {
            from: brandname || "GoSafe",
            to: phoneNumber,
            text: message,
          },
        ],
      }),
    });

    const smsResult = await smsResponse.json();
    console.log("📱 Stringee response:", smsResult);

    if (smsResult.r === 0) {
      console.log("✅ SMS Brandname sent successfully");
      res.json({
        success: true,
        message: "SMS Brandname sent successfully",
        data: smsResult,
      });
    } else {
      throw new Error(smsResult.message || "SMS sending failed");
    }
  } catch (error) {
    console.error("❌ SMS Brandname error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

if (require.main === module) {
  // Chỉ chạy khi local
  server.listen(PORT, () => {
    console.log(`🚀 GoSafe Backend Server with Chat running on port ${PORT}`);
    console.log(`💬 Socket.IO Chat enabled`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(
      `🔧 Decode phone: POST http://localhost:${PORT}/api/decode-phone`
    );

    if (!ZALO_APP_ID || !ZALO_APP_SECRET) {
      console.warn(
        "⚠️  Warning: ZALO_APP_ID and ZALO_APP_SECRET not configured in .env"
      );
    }
  });
}

// Export app cho Vercel
module.exports = app;
