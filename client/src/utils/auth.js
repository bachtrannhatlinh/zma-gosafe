export const getAccessToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('gosafe_jwt_token');
    }
    return null;
  } catch (error) {
    console.warn('Cannot access localStorage:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  return token && typeof token === 'string' && token.length > 0;
};

export const clearAuth = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('gosafe_jwt_token');
      localStorage.removeItem('gosafe_user_info');
    }
  } catch (error) {
    console.warn('Cannot clear auth from localStorage:', error);
  }
};