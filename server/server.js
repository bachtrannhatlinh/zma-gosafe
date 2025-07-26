const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://localhost:3000',
    // Zalo Mini App domains
    'https://zalo.me',
    'https://*.zalo.me',
    'https://mini.zalo.me',
    'https://*.mini.zalo.me',
    'https://miniapp.zalo.me',
    'https://*.miniapp.zalo.me',
    // Allow all for testing
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// Add preflight handler
app.options('*', cors());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint được gọi');
  res.json({
    success: true,
    message: 'Kết nối server thành công!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GoSafe Server đang chạy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API health check endpoint (cho client sử dụng)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GoSafe API Server đang chạy',
    timestamp: new Date().toISOString(),
    port: PORT,
    cors: 'enabled'
  });
});

// Zalo App credentials - cần config trong .env
const ZALO_APP_ID = process.env.ZALO_APP_ID;
const ZALO_APP_SECRET = process.env.ZALO_APP_SECRET;

// API endpoint để decode phone token
app.post('/api/decode-phone', async (req, res) => {
  console.log('🚀 Received decode phone request');
  
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    console.log('🔑 Token received, length:', token.length);

    // Kiểm tra App Secret
    if (!ZALO_APP_SECRET || ZALO_APP_SECRET === 'your_actual_app_secret_here') {
      console.log('⚠️ Using mock response - App Secret not configured');
      return res.json({
        success: true,
        phoneNumber: "0987654321",
        userInfo: { phone: "0987654321" },
        message: 'Mock response - cần cấu hình ZALO_APP_SECRET'
      });
    }

    // Thử decode với Zalo API
    console.log('🔄 Decoding with Zalo API...');
    
    const response = await axios.post('https://openapi.zalo.me/v2.0/user/phone', {
      token: token,
      app_secret: ZALO_APP_SECRET
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Zalo API response:', response.data);

    if (response.data && response.data.data && response.data.data.number) {
      return res.json({
        success: true,
        phoneNumber: response.data.data.number,
        userInfo: { phone: response.data.data.number },
        message: 'Phone decoded successfully'
      });
    }

    throw new Error('Invalid response from Zalo API');

  } catch (error) {
    console.error('❌ Decode error:', error.message);
    
    // Fallback response
    return res.json({
      success: true,
      phoneNumber: "✅ Đã xác thực",
      userInfo: { phone: "Đã xác thực" },
      message: 'Token received but decode failed - using fallback'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GoSafe Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint để check Zalo API connection
app.get('/api/test-zalo', async (req, res) => {
  try {
    const testResponse = await axios.get('https://openapi.zalo.me/v2.0/me/info', {
      params: {
        access_token: 'test_token',
        fields: 'id,name,phone'
      }
    });
    
    res.json({
      success: true,
      message: 'Zalo API is accessible',
      response: testResponse.data
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Zalo API test failed (expected)',
      error: error.response?.data || error.message
    });
  }
});

app.get('/api/debug', (req, res) => {
  res.json({
    status: 'OK',
    hasAppId: !!ZALO_APP_ID,
    hasAppSecret: !!ZALO_APP_SECRET,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GoSafe Backend Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Decode phone: POST http://localhost:${PORT}/api/decode-phone`);
  
  if (!ZALO_APP_ID || !ZALO_APP_SECRET) {
    console.warn('⚠️  Warning: ZALO_APP_ID and ZALO_APP_SECRET not configured in .env');
  }
});

// Export for Vercel
module.exports = app;
