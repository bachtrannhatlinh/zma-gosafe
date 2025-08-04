import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getServerUrl } from '../config/server';

const JWT_STORAGE_KEY = 'gosafe_jwt_token';
const USER_STORAGE_KEY = 'gosafe_user_info';

export const useJWT = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load từ localStorage (ZMP hỗ trợ localStorage)
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(JWT_STORAGE_KEY);
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        console.log('✅ JWT loaded from storage');
      }
    } catch (error) {
      console.error('❌ Error loading JWT:', error);
    }
  }, []);

  const jwtLogin = useCallback(async (userId, userInfo = null) => {
    setLoading(true);
    
    try {
      console.log('🔑 JWT Login attempt:', { userId, userInfo });
      
      const response = await axios({
        method: 'POST',
        url: `${getServerUrl()}/api/auth/jwt-login`, // Fix URL path
        headers: {
          'Content-Type': 'application/json',
          ...getRequestHeaders()
        },
        data: {
          userId: userId,
          userInfo: userInfo
        },
        timeout: 10000
      });

      if (response.data?.token) {
        localStorage.setItem('gosafe_jwt_token', response.data.token);
        setIsAuthenticated(true);
        console.log('✅ JWT login successful');
        return { success: true, token: response.data.token };
      }
      
      throw new Error('No token received from server');
      
    } catch (error) {
      let errorMessage = 'Network error or server unavailable';
      
      if (error.response) {
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = error.message;
      }
      
      console.error('❌ JWT login error:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear from localStorage
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    console.log('✅ JWT logout completed');
  }, []);

  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`
    };
  }, [token]);

  return {
    token,
    user,
    isAuthenticated,
    loading,
    jwtLogin,
    logout,
    getAuthHeaders
  };
};
