import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from "zmp-sdk/apis";
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUserInfo = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserInfo must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { login: jwtLogin, user: jwtUser, isAuthenticated } = useAuth();

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🚀 Fetching user info...");
      
      const { userInfo: zaloUserInfo } = await getUserInfo({});
      console.log("✅ User info fetched:", zaloUserInfo);
      
      setUserInfo(zaloUserInfo);

      // Auto login with JWT if not authenticated
      if (!isAuthenticated && zaloUserInfo?.id) {
        console.log("🔑 Auto login with JWT...");
        await jwtLogin(zaloUserInfo.id, zaloUserInfo);
      }

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

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{
      userInfo,
      isLoading,
      error,
      fetchUserInfo,
      refetchUserInfo,
      // JWT user info
      jwtUser,
      isAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};
