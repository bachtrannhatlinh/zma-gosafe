import { useState } from 'react';
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis';

// Server URL - switch between localhost and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Multiple server URLs for better reliability
const SERVER_URLS = isDevelopment 
  ? ['http://localhost:3001'] 
  : [
      'https://zma-gosafe-c2pee8u0f-bachtrannhatlinhs-projects.vercel.app',
      'https://zma-gosafe.vercel.app', // backup URL
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

    try {
      // Test server connection first với timeout
      console.log('🔍 Testing server connection...');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const healthResponse = await fetch(`${SERVER_URL}/api/health`, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ Server is reachable:', healthData.message);
        } else {
          throw new Error(`Server health check failed: ${healthResponse.status}`);
        }
      } catch (healthError) {
        console.error('❌ Server connection test failed:', healthError);
        if (healthError.name === 'AbortError') {
          throw new Error('Server timeout');
        }
        // Simplified error - no need to show CORS details to user
        throw new Error('Không thể kết nối server');
      }

      let tokenToSend = phoneToken; // Use provided token first
      
      // Nếu không có token được truyền vào, thử lấy từ Zalo
      if (!tokenToSend) {
        console.log('🔄 Getting phone token from Zalo...');
        
        // Thử lấy phone token trực tiếp
        const phoneTokenResponse = await new Promise((resolve, reject) => {
          getPhoneNumber({
            success: (data) => {
              console.log('✅ Phone token received:', data);
              resolve(data);
            },
            fail: (error) => {
              console.error('❌ Failed to get phone token:', error);
              reject(error);
            }
          });
        });

        if (phoneTokenResponse && phoneTokenResponse.token) {
          console.log('📱 Using phone token');
          tokenToSend = phoneTokenResponse.token;
        } else {
          console.log('🔄 Phone token not available, trying access token...');
          
          // Fallback: thử access token
          const accessTokenResponse = await new Promise((resolve, reject) => {
            getAccessToken({
              success: (data) => {
                console.log('✅ Access token received:', data);
                resolve(data);
              },
              fail: (error) => {
                console.error('❌ Failed to get access token:', error);
                reject(error);
              }
            });
          });
          
          tokenToSend = typeof accessTokenResponse === 'string' ? accessTokenResponse : accessTokenResponse.accessToken;
        }
      } else {
        console.log('📱 Using provided phone token');
      }
      
      if (!tokenToSend) {
        throw new Error('No token received from Zalo');
      }

      console.log('🚀 Sending token to server...');
      console.log('🔑 Token preview:', tokenToSend.substring(0, 50) + '...');
      console.log('🔑 Token length:', tokenToSend.length);
      
      // Gửi token đến server để decode số điện thoại
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: tokenToSend
        })
      }).catch(error => {
        console.error('🔥 Fetch failed:', error);
        // Simplified error handling
        throw new Error(`Không thể kết nối server: ${error.name}`);
      });

      console.log('📡 Server response status:', response.status);
      console.log('📡 Server response ok:', response.ok);

      if (!response.ok) {
        console.error('📡 Server returned error status:', response.status);
        let errorText = 'Server error';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || errorText;
        } catch (e) {
          errorText = `HTTP ${response.status}`;
        }
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('📡 Server response data:', result);

      console.log('✅ Server response SUCCESS:', result);
      
      return {
        success: true,
        phoneNumber: result.phoneNumber,
        userInfo: result.userInfo,
        message: result.message
      };

    } catch (error) {
      console.error('❌ Error in sendTokenToServer:', error);
      setError(error.message);
      
      return {
        success: false,
        error: error.message
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
