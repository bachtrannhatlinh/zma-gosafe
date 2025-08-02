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

  const login = useCallback(async (zaloUserId, userInfo) => {
    setLoading(true);
    
    try {
      // Sử dụng axios thay vì fetch
      const response = await axios.post(`${getServerUrl()}/api/auth/login`, {
        zaloUserId,
        userInfo
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
      
      localStorage.setItem(JWT_STORAGE_KEY, result.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));

      return { success: true, user: result.user };

    } catch (error) {
      console.error('❌ JWT login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
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
    login,
    getAuthHeaders
  };
};
