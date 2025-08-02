import React, { createContext, useContext } from 'react';
import { useJWT } from '../hooks/useJWT';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const jwtAuth = useJWT();
  return (
    <AuthContext.Provider value={jwtAuth}>
      {children}
    </AuthContext.Provider>
  );
};
