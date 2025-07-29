import { useState } from 'react';
// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const SERVER_URLS = isDevelopment 
  ? ['http://localhost:5000'] 
  : [
      'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app', // URL Vercel chính xác
      'https://79d5fb63007d.ngrok-free.app', // URL ngrok backup
    ];

const getCurrentServerUrl = () => {
  return SERVER_URLS[0]; // Use first URL by default
};

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken) => {
    setLoading(true);
    setError(null);
    
    console.log('🚀 Sending token to server for decode...');
    
    const SERVER_URL = getCurrentServerUrl();
    
    try {
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ token: phoneToken }),
        timeout: 15000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Server response:', result);
      
      // Trả về kết quả thực từ server
      return result;
      
    } catch (error) {
      console.error('❌ Server error:', error);
      setError(error.message);
      
      // Fallback với thông báo lỗi rõ ràng
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
