import { useState, useCallback } from 'react';
import { getUserInfo } from 'zmp-sdk/apis';

export const useServerAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Đổi thành false
  const [error, setError] = useState(null);

  const getZaloUserInfo = async () => {
    return new Promise((resolve, reject) => {
      getUserInfo({
        success: (data) => {
          console.log('✅ Zalo getUserInfo success:', data);
          
          let phone = localStorage.getItem('user_phone') || 
                     localStorage.getItem('zalo_phone') ||
                     localStorage.getItem('phoneNumber');
          
          if (!phone && data.userInfo) {
            phone = data.userInfo.phone || data.userInfo.phoneNumber;
          }
          
          console.log('📱 Phone found:', phone);
          
          const result = {
            ...data.userInfo,
            phone: phone || null
          };
          
          console.log('📋 Final userInfo:', result);
          resolve(result);
        },
        fail: (error) => {
          console.error('❌ Zalo getUserInfo failed:', error);
          reject(new Error('Không thể lấy thông tin người dùng'));
        }
      });
    });
  };

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 useServerAuth: Starting auth check');
      
      const authResult = await getZaloUserInfo();
      console.log('🔍 useServerAuth: Auth result:', authResult);
      
      setUserInfo(authResult);
      return authResult;
    } catch (err) {
      console.error('❌ useServerAuth error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Xóa useEffect - không tự động chạy nữa

  return {
    userInfo,
    loading,
    error,
    checkAuth
  };
};
