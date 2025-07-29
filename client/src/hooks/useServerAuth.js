import { useState } from 'react';
// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const getCurrentServerUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  // Sử dụng URL Vercel mới nhất
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
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Server response:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Server error:', error);
      
      // Retry logic
      if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        console.log(`🔄 Retrying... (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        return sendTokenToServer(phoneToken, retryCount + 1);
      }
      
      setError(error.message);
      
      return {
        success: false,
        error: error.message,
        phoneNumber: "Không thể lấy số điện thoại",
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
