import { useState } from 'react';
import { AbortSignal } from 'abort-controller';

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken, retryCount = 0) => {
    setLoading(true);
    setError(null);

    // Determine server URL
    const SERVER_URL = process.env.NODE_ENV === 'production' 
      ? 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app'
      : 'http://localhost:5000';

    console.log('🌐 Using server URL:', SERVER_URL);
    console.log('🔐 Sending token:', phoneToken?.substring(0, 20) + '...');

    try {
      // Test server health first với timeout ngắn
      console.log('🔍 Testing server connection...');
      const healthResponse = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        signal: AbortSignal.timeout(5000) // 5s timeout
      });
      
      if (!healthResponse.ok) {
        throw new Error(`Server not available: ${healthResponse.status}`);
      }
      
      console.log('✅ Server is reachable');
      
      // Now send the actual request
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ token: phoneToken }),
        signal: AbortSignal.timeout(15000) // 15s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);

      return data;

    } catch (error) {
      console.error('❌ Server error:', error);
      
      // Retry logic với exponential backoff
      if (retryCount < 2 && (error.name === 'TimeoutError' || error.message.includes('fetch'))) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
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
    const SERVER_URL = getServerUrl();
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
