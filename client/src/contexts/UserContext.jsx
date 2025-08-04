import React, { createContext, useContext, useState, useEffect } from 'react';
import { getZMPUserInfo } from '../utils/zmpSafe';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = await getZMPUserInfo();
        
        if (user) {
          // Lấy phoneNumber từ localStorage (cho migration)
          const storedPhone = localStorage.getItem("user_phone");
          const phoneNumber = user.phoneNumber || 
            (storedPhone && 
             storedPhone !== "Chưa có số điện thoại" && 
             storedPhone !== "Cần cấp quyền" &&
             storedPhone !== "null" &&
             storedPhone !== "undefined" 
             ? storedPhone : null);

          // Đảm bảo userInfo có field phoneNumber
          const userInfoWithPhone = {
            ...user,
            phoneNumber
          };
          setUserInfo(userInfoWithPhone);
          console.log('✅ User info loaded successfully:', userInfoWithPhone);
        } else {
          console.warn('⚠️ No user info received from ZMP');
          setError('Failed to load user info');
        }
      } catch (err) {
        console.error('❌ Error loading user info:', err);
        setError(err.message);
        
        // Fallback: Set loading false sau khi error
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Thêm method để cập nhật số điện thoại
  const updatePhoneNumber = (phoneNumber) => {
    setUserInfo(prev => ({
      ...prev,
      phoneNumber
    }));
  };

  // Thêm method để refetch user info
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const user = await getZMPUserInfo();
      
      if (user) {
        // Giữ nguyên phoneNumber hiện tại nếu đã có, chỉ cập nhật nếu chưa có
        setUserInfo(prev => {
          const currentPhone = prev?.phoneNumber;
          
          // Lấy phoneNumber từ localStorage (cho migration)
          const storedPhone = localStorage.getItem("user_phone");
          const phoneNumber = currentPhone || user.phoneNumber || 
            (storedPhone && 
             storedPhone !== "Chưa có số điện thoại" && 
             storedPhone !== "Cần cấp quyền" &&
             storedPhone !== "null" &&
             storedPhone !== "undefined" 
             ? storedPhone : null);

          // Đảm bảo userInfo có field phoneNumber
          const userInfoWithPhone = {
            ...user,
            phoneNumber
          };
          
          return userInfoWithPhone;
        });
        
        return userInfo;
      } else {
        throw new Error('Failed to load user info');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userInfo,
    loading,
    error,
    setUserInfo,
    updatePhoneNumber,
    fetchUserInfo,
    clearUserInfo: () => setUserInfo(null),
    isLoading: loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserInfo must be used within UserProvider');
  }
  return context;
};