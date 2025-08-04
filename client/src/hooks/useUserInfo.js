import { useState, useEffect } from 'react';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Safe ZMP SDK access
        if (typeof window !== 'undefined' && window.ZaloJavaScriptInterface) {
          // Try Zalo native method first
          const result = await new Promise((resolve, reject) => {
            window.ZaloJavaScriptInterface.getUserInfo((data) => {
              try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                resolve(parsed);
              } catch (err) {
                reject(err);
              }
            });
          });
          
          setUserInfo(result);
        } else {
          // Fallback to ZMP SDK
          const { getUserInfo } = await import('zmp-sdk/apis');
          const result = await getUserInfo({});
          setUserInfo(result);
        }
        
      } catch (err) {
        console.error('❌ Error fetching user info:', err);
        
        // Fallback to mock data for testing
        const mockUser = {
          id: 'mock_user_123',
          name: 'Test User',
          avatar: ''
        };
        
        setUserInfo(mockUser);
        setError('Using mock user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};
