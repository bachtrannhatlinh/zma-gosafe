import { useState, useCallback } from 'react';
import axios from 'axios';
import { getServerUrl, getRequestHeaders } from '../utils/serverConfig';

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
        if (token) {
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
        timeout: 10000, // Add timeout
        ...options
      };

      const response = await axios(config);
      return response.data;

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
