const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://localhost:3000',
    'https://localhost:3001',
    'http://localhost:3001',
    // Add Zalo Mini App domains
    'https://zalo.me',
    'https://*.zalo.me',
    'https://mini.zalo.me',
    'https://*.mini.zalo.me',
    // Allow all for development
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  res.sendStatus(200);
});

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
    port: PORT
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

    console.log('🔑 Token received:', token.substring(0, 50) + '...');
    console.log('🔑 Token length:', token.length);

    // TODO: TEMPORARY - Mock response for testing UI
    // Comment this out when Zalo API is working
    // if (token.length > 50) { // Relaxed condition cho testing
    //   console.log('🧪 Using mock response for testing');
    //   return res.json({
    //     success: true,
    //     phoneNumber: "0987654321", // Mock số điện thoại cho testing
    //     userInfo: {
    //       phone: "0987654321",
    //       name: "Test User",
    //       id: "mock_user_123"
    //     },
    //     message: 'Mock phone number for testing UI (server response working)'
    //   });
    // }
    // END TEMPORARY MOCK

    // Nếu không có App Secret, dùng mock response
    if (!ZALO_APP_SECRET || ZALO_APP_SECRET === 'your_actual_app_secret_here') {
      console.log('⚠️  App Secret chưa được cấu hình, sử dụng mock data');
      return res.json({
        success: true,
        phoneNumber: "0912345678", // Mock số điện thoại
        userInfo: {
          phone: "0912345678",
          name: "Demo User",
          id: "demo_user_456"
        },
        message: 'Demo phone number (cần cấu hình ZALO_APP_SECRET để lấy số thật)'
      });
    }

    // Kiểm tra nếu có App Secret để decode phone token
    if (ZALO_APP_SECRET && ZALO_APP_SECRET !== 'your_zalo_app_secret_here') {
      try {
        console.log('🔄 Trying phone token decode with App Secret...');
        
        // Zalo phone token decode API
        const phoneDecodeUrl = 'https://openapi.zalo.me/v2.0/user/phone';
        const phoneResponse = await axios.post(phoneDecodeUrl, {
          token: token,
          app_secret: ZALO_APP_SECRET
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('✅ Phone decode response:', phoneResponse.data);

        if (phoneResponse.data && phoneResponse.data.data) {
          const phoneData = phoneResponse.data.data;
          
          return res.json({
            success: true,
            phoneNumber: phoneData.number,
            userInfo: {
              phone: phoneData.number
            },
            message: 'Phone number decoded successfully with App Secret'
          });
        }

      } catch (phoneError) {
        console.error('❌ Phone decode with App Secret failed:', phoneError.response?.data || phoneError.message);
      }
    } else {
      console.log('⚠️  App Secret not configured, skipping phone decode');
    }

    // Fallback: Thử với phone API endpoint khác
    try {
      console.log('🔄 Trying phone API endpoint...');
      const phoneApiUrl = 'https://openapi.zalo.me/v2.0/me/phone';
      
      const phoneResponse = await axios.get(phoneApiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('✅ Phone API response:', phoneResponse.data);

      if (phoneResponse.data && phoneResponse.data.data) {
        const phoneData = phoneResponse.data.data;
        
        return res.json({
          success: true,
          phoneNumber: phoneData.number,
          userInfo: {
            phone: phoneData.number
          },
          message: 'Phone number decoded successfully from phone API'
        });
      }

    } catch (phoneError) {
      console.error('❌ Phone API failed:', phoneError.response?.data || phoneError.message);
    }

    // Fallback: Thử với user info API
    const userInfoUrl = 'https://openapi.zalo.me/v2.0/me/info';
    
    try {
      console.log('🔄 Trying user info API...');
      const userResponse = await axios.get(userInfoUrl, {
        params: {
          access_token: token,
          fields: 'id,name,phone'
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('✅ User info response:', userResponse.data);

      if (userResponse.data && userResponse.data.data) {
        const userData = userResponse.data.data;
        
        return res.json({
          success: true,
          phoneNumber: userData.phone,
          userInfo: {
            id: userData.id,
            name: userData.name,
            phone: userData.phone
          },
          message: 'Phone number decoded successfully from user info'
        });
      }

    } catch (userError) {
      console.error('❌ User info API failed:', userError.response?.data || userError.message);
    }

    // Fallback: Thử với alternative method
    try {
      console.log('🔄 Trying alternative API...');
      const alternativeUrl = 'https://openapi.zalo.me/v2.0/me';
      const altResponse = await axios.get(alternativeUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('✅ Alternative API Response:', altResponse.data);
      
      if (altResponse.data && altResponse.data.phone) {
        return res.json({
          success: true,
          phoneNumber: altResponse.data.phone,
          userInfo: altResponse.data,
          message: 'Phone number decoded successfully (alternative method)'
        });
      }
    } catch (altError) {
      console.error('❌ Alternative API also failed:', altError.response?.data || altError.message);
    }

    // Nếu tất cả đều thất bại, trả về error chi tiết
    return res.status(500).json({
      success: false,
      error: 'Failed to decode token with all Zalo API methods',
      details: 'Token may be invalid or expired, or wrong token type',
      tokenPreview: token.substring(0, 50) + '...'
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
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
