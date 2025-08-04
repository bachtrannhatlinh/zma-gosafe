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
      // Sử dụng axios thay vì fetch với timeout
      const response = await axios.post(`${getServerUrl()}/api/auth/login`, {
        zaloUserId,
        userInfo
      }, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json'
        }
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

      console.log('✅ JWT login successful');
      return { success: true, user: result.user };

    } catch (error) {
      let errorMessage = 'Network error or server unavailable';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        // Timeout
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
    
    // Clear từ localStorage
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
    login,
    logout,
    getAuthHeaders
  };
};
