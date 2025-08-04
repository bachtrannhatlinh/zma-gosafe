import { useState, useCallback } from 'react';

export const usePhone = () => {
  const [phoneData, setPhoneData] = useState({
    hasPhone: false,
    currentPhone: null,
    phoneNumber: null,
    phoneNumberType: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPhone = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check localStorage first
      const storedPhone = localStorage.getItem('user_phone');
      if (storedPhone) {
        const phoneInfo = {
          hasPhone: true,
          currentPhone: storedPhone,
          phoneNumber: storedPhone,
          phoneNumberType: 'stored'
        };
        setPhoneData(phoneInfo);
        return phoneInfo;
      }

      // Try ZMP SDK
      try {
        const { getPhoneNumber } = await import('zmp-sdk/apis');
        const result = await getPhoneNumber({});
        
        if (result && result.number) {
          const phoneInfo = {
            hasPhone: true,
            currentPhone: result.number,
            phoneNumber: result.number,
            phoneNumberType: 'zmp'
          };
          
          // Store for future use
          localStorage.setItem('user_phone', result.number);
          setPhoneData(phoneInfo);
          return phoneInfo;
        }
      } catch (zmpError) {
        console.warn('ZMP phone access failed:', zmpError);
      }

      // Fallback
      const fallbackInfo = {
        hasPhone: false,
        currentPhone: null,
        phoneNumber: null,
        phoneNumberType: null
      };
      
      setPhoneData(fallbackInfo);
      return fallbackInfo;
      
    } catch (err) {
      console.error('Phone check error:', err);
      setError(err.message);
      return { hasPhone: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { phoneData, checkPhone, loading, error };
};