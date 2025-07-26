import { useState } from 'react';
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis';

// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const SERVER_URLS = isDevelopment 
  ? ['http://localhost:5000'] 
  : [
      'https://gosafe-backend.vercel.app', // URL mới từ Vercel
      'https://server-weld-mu-76.vercel.app', // Backup
    ];

const getCurrentServerUrl = () => {
  return SERVER_URLS[0]; // Use first URL by default
};

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken = null) => {
    setLoading(true);
    setError(null);
    
    const SERVER_URL = getCurrentServerUrl();
    console.log('🔗 Using server URL:', SERVER_URL);

    try {
      console.log('🚀 Sending token to real server...');
      
      if (!phoneToken) {
        throw new Error('No token provided');
      }

      console.log('🔑 Token preview:', phoneToken.substring(0, 50) + '...');
      
      // Test server health first
      const healthResponse = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (!healthResponse.ok) {
        throw new Error('Server health check failed');
      }
      
      console.log('✅ Server is healthy, sending token...');
      
      // Real server request
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: phoneToken
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Real server response:', result);
      return result;

    } catch (error) {
      console.error('❌ Server error:', error.name, error.message);
      
      // Fallback to mock if server fails
      console.log('🔄 Using fallback mock response');
      return {
        success: true,
        phoneNumber: "Mock: 0987654321",
        userInfo: { phone: "Mock: 0987654321" },
        message: 'Fallback response - server unavailable'
      };
    } finally {
      setLoading(false);
    }
  };

  const testServerConnection = async () => {
    const SERVER_URL = getCurrentServerUrl();
    try {
      const response = await fetch(`${SERVER_URL}/api/health`);
      const result = await response.json();
      
      console.log('🔄 Server health check:', result);
      return result;
    } catch (error) {
      console.error('❌ Server connection failed:', error);
      throw error;
    }
  };

  return {
    sendTokenToServer,
    testServerConnection,
    loading,
    error
  };
};
