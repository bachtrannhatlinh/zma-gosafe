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
        const user = await getZMPUserInfo();
        
        if (user) {
          setUserInfo(user);
          console.log('✅ User info loaded:', user);
        } else {
          setError('Failed to load user info');
        }
      } catch (err) {
        console.error('❌ User context error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const value = {
    userInfo,
    loading,
    error,
    setUserInfo
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
