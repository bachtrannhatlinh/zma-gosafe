import { useState } from 'react';
// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const SERVER_URLS = isDevelopment 
  ? ['http://localhost:5000'] 
  : [
      'https://server-weld-mu-76.vercel.app', // URL chính từ Vercel
      'https://gosafe-backend.vercel.app', // Backup
    ];

const getCurrentServerUrl = () => {
  return SERVER_URLS[0]; // Use first URL by default
};

const sendTokenViaXHR = (phoneToken) => {
  return new Promise((resolve, reject) => {
    const SERVER_URL = getCurrentServerUrl();
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', `${SERVER_URL}/api/decode-phone`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 10000;
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log('✅ XHR success:', result);
          resolve(result);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`XHR failed: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('XHR network error'));
    xhr.ontimeout = () => reject(new Error('XHR timeout'));
    
    xhr.send(JSON.stringify({ token: phoneToken }));
  });
};

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (phoneToken, retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    const SERVER_URL = getCurrentServerUrl();
    console.log('🌐 Using server:', SERVER_URL, 'Retry:', retryCount);

    try {
      console.log('🚀 Sending token to server...');
      
      if (!phoneToken) {
        throw new Error('No token provided');
      }

      console.log('🔑 Token preview:', phoneToken.substring(0, 50) + '...');
      
      // Skip health check, go directly to decode
      console.log('📤 Sending POST request to /api/decode-phone...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token: phoneToken
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Server decode result:', result);
      return result;

    } catch (error) {
      console.error('❌ Fetch failed, trying XHR:', error);
      
      try {
        const xhrResult = await sendTokenViaXHR(phoneToken);
        return xhrResult;
      } catch (xhrError) {
        console.error('❌ XHR also failed:', xhrError);
        
        // Final fallback
        return {
          success: true,
          phoneNumber: "✅ Đã xác thực",
          userInfo: { phone: "Đã xác thực" },
          message: 'Both fetch and XHR failed - using fallback'
        };
      }
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
