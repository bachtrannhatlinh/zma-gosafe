const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.post("/api/zalo-phone", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post("https://graph.zalo.me/v2.0/oa/getphone", null, {
      params: {
        code,
        app_id: process.env.ZALO_APP_ID,
        app_secret: process.env.ZALO_APP_SECRET,
      },
    });

    const { data } = response;
    if (data && data.data && data.data.phone) {
      res.json({ phone: data.data.phone });
    } else {
      res.status(400).json({ error: "Không lấy được số điện thoại" });
    }
  } catch (error) {
    console.error("Lỗi backend:", error.response?.data || error.message);
    res.status(500).json({ error: "Lỗi server khi truy vấn Zalo API" });
  }
});

// Cải thiện endpoint decode-phone với axios và headers đúng
app.post("/api/decode-phone", async (req, res) => {
  console.log("🚀 Received decode phone request");
  const { token, accessToken } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Token is required"
    });
  }

  try {
    // Your existing decode logic here
    const response = await axios.post("https://graph.zalo.me/v2.0/me/token", {
      code: token,
      app_id: process.env.ZALO_APP_ID,
      app_secret: process.env.ZALO_APP_SECRET,
      grant_type: "authorization_code"
    });

    // Continue with phone number retrieval...
    
  } catch (error) {
    console.error("❌ Error decoding phone:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

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
  app.listen(PORT, () => {
    console.log(`🚀 GoSafe Backend Server running on port ${PORT}`);
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
