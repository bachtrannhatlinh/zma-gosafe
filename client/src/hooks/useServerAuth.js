import { useState } from 'react';
// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const getCurrentServerUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  // Cập nhật URL production mới nhất
  return 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';
};

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken, retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    console.log(`🚀 Sending token to server (attempt ${retryCount + 1})...`);
    
    const SERVER_URL = getCurrentServerUrl();
    console.log(`📍 Server URL: ${SERVER_URL}`);
    
    try {
      // Test server health first
      console.log('🔍 Testing server connection...');
      const healthResponse = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: 5000
      });
      
      if (!healthResponse.ok) {
        throw new Error(`Server not available: ${healthResponse.status}`);
      }
      
      console.log('✅ Server is reachable');
      
      // Now send the actual request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ token: phoneToken }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Server response:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Server error:', error);
      
      // Retry logic với exponential backoff
      if (retryCount < 3 && (error.name === 'AbortError' || error.message.includes('fetch') || error.message.includes('Load failed'))) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🔄 Retrying in ${delay}ms... (${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendTokenToServer(phoneToken, retryCount + 1);
      }
      
      setError(error.message);
      
      return {
        success: false,
        error: error.message,
        phoneNumber: "Lỗi kết nối server",
      };
    } finally {
      setLoading(false);
    }
  };

  const testServerConnection = async () => {
    const SERVER_URL = getCurrentServerUrl();
    try {
      console.log('🔄 Testing server connection...');
      const response = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: 5000
      });
      
      if (!response.ok) {
        throw new Error(`Server not responding: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Server health check passed:', result);
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
