import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from 'zmp-sdk/apis';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🚀 Fetching user info...");
      const { userInfo: zaloUserInfo } = await getUserInfo({});
      console.log("✅ User info fetched:", zaloUserInfo);
      setUserInfo(zaloUserInfo);
      return zaloUserInfo;
    } catch (error) {
      console.error("❌ Error fetching user info:", error);
      setError(error.message || "Không thể lấy thông tin người dùng");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUserInfo = async () => {
    return await fetchUserInfo();
  };

  const clearUserInfo = () => {
    setUserInfo(null);
    setError(null);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const value = {
    userInfo,
    isLoading,
    error,
    fetchUserInfo,
    refetchUserInfo,
    clearUserInfo
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
    throw new Error('useUserInfo must be used within a UserProvider');
  }
  return context;
};
