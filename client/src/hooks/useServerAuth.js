import { useState, useCallback } from 'react';

export const useServerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendTokenToServer = useCallback(async (tokenOrPhone) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🚀 Sending to server:", tokenOrPhone);
      
      // Nếu là token, gửi lên server để lấy số thật
      if (tokenOrPhone === "Đã có token" || typeof tokenOrPhone === 'string' && tokenOrPhone.length > 20) {
        // Gọi API server để decode token
        const response = await fetch('/api/phone/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
      }
      
      // Nếu đã có số điện thoại, return luôn
      return { 
        success: true, 
        phoneNumber: tokenOrPhone 
      };
      
    } catch (err) {
      console.error("❌ Server auth error:", err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendTokenToServer,
    loading,
    error
  };
};
