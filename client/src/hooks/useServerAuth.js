import { useState, useCallback } from 'react';

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = async (tokenOrPhone) => {
    try {
      console.log("🚀 Sending to server:", tokenOrPhone);
      
      // Fix API endpoint path
      const response = await fetch(`${getServerUrl()}/api/phone/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getRequestHeaders()
        },
        body: JSON.stringify({ token: tokenOrPhone })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Server response:", result);
      
      return { 
        success: true, 
        phoneNumber: result.phoneNumber,
        userInfo: result.userInfo 
      };
      
    } catch (error) {
      console.error('❌ Server auth error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    sendTokenToServer,
    loading,
    error
  };
};
