import { useState } from 'react';
import { openSMS } from 'zmp-sdk/apis';

export const useSMS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendSMS = async (phoneNumber, content) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📱 Sending SMS:', { phoneNumber, content });
      
      const result = await new Promise((resolve, reject) => {
        openSMS({
          phoneNumber: phoneNumber.trim(),
          content: content.trim(),
          success: (data) => {
            console.log('✅ SMS success:', data);
            resolve(data);
          },
          fail: (error) => {
            console.error('❌ SMS failed:', error);
            reject(error);
          }
        });
      });

      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ SMS error:', error);
      setError(error.message || 'Gửi SMS thất bại');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendSMS,
    loading,
    error
  };
};