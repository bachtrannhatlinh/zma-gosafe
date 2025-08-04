import { useState, useCallback } from 'react';
import axios from 'axios';
import { getServerUrl, getRequestHeaders } from '../config/server';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get auth headers safely
      let authHeaders = {};
      try {
        const token = localStorage.getItem('gosafe_jwt_token');
        if (token && typeof token === 'string') {
          authHeaders = { 'Authorization': `Bearer ${token}` };
        }
      } catch (err) {
        console.warn('Could not get auth token:', err);
      }

      const config = {
        url: `${getServerUrl()}${endpoint}`,
        method: options.method || 'GET',
        headers: {
          ...getRequestHeaders(),
          ...authHeaders,
          ...options.headers
        },
        timeout: 15000,
        ...options
      };

      console.log('🚀 API Request:', config.method, config.url);
      
      const response = await axios(config);
      
      console.log('✅ API Response:', response.status, response.data);
      return response.data;

    } catch (err) {
      let errorMsg = 'Network error';
      
      if (err.response) {
        errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = 'No response from server';
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout';
      } else {
        errorMsg = err.message || 'Unknown error';
      }
      
      console.error('❌ API Error:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
