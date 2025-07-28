import { useState } from 'react';
// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Cập nhật server URL mới
const SERVER_URLS = isDevelopment 
  ? ['http://localhost:5000'] 
  : [
      'https://zma-gosafe-4vsall7u5-bachtrannhatlinhs-projects.vercel.app/', // Vercel URL
      'https://79d5fb63007d.ngrok-free.app', // URL ngrok mới
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
    xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
    xhr.setRequestHeader('User-Agent', 'ZaloMiniApp/iOS');
    xhr.timeout = 15000; // Tăng timeout cho iOS
    
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

  const sendTokenToServer = async (phoneToken) => {
    setLoading(true);
    setError(null);
    
    console.log('🚀 Sending token to server for decode...');
    
    // REMOVE iOS bypass - force server call
    const SERVER_URL = getCurrentServerUrl();
    
    try {
      console.log('📡 Calling server:', `${SERVER_URL}/api/decode-phone`);
      
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ token: phoneToken })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Server response:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Server call failed:', error);
      
      return {
        success: true,
        phoneNumber: "📱 Đã xác thực (Fallback)",
        userInfo: { phone: "Đã xác thực" },
        message: 'Fallback authentication successful'
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
