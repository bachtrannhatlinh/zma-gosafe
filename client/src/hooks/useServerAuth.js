import { useState } from 'react';
import { AbortSignal } from 'abort-controller';
import { getServerUrl } from '../config/server';

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken, retryCount = 0) => {
    setLoading(true);
    setError(null);

    const SERVER_URL = getServerUrl();
    console.log('🌐 Using server URL:', SERVER_URL);
    console.log('🔐 Sending token:', phoneToken?.substring(0, 20) + '...');

    try {
      // Test server health first
      console.log('🔍 Testing server connection...');
      const healthResponse = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!healthResponse.ok) {
        throw new Error(`Server not available: ${healthResponse.status}`);
      }
      
      console.log('✅ Server is reachable');
      
      // Send decode request
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ token: phoneToken }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);
      return data;

    } catch (error) {
      console.error('❌ Server error:', error);
      
      if (retryCount < 2 && (error.name === 'TimeoutError' || error.message.includes('fetch'))) {
        const delay = Math.pow(2, retryCount) * 1000;
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
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
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
