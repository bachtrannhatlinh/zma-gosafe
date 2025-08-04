import { getUserInfo } from "zmp-sdk/apis";

// Thêm fallback server cho development
const getServerURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.URL_SERVER_LOCAL || 'http://localhost:5000';
  }
  return process.env.URL_SERVER || "https://zma-gosafe-bachtrannhatlinhs-projects.vercel.app";
};

const SERVER_URL = getServerURL();

export const getAccessToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Thử cả 2 key
      return localStorage.getItem('gosafe_jwt_token') || localStorage.getItem('jwt_token');
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

export const authenticateWithZalo = async (userInfo) => {
  try {
    console.log('Authenticating with user info:', userInfo);
    
    const response = await fetch(`${SERVER_URL}/auth/zalo-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zaloUserId: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        phoneNumber: userInfo.phoneNumber || null,
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.jwtToken) {
      // Lưu cùng key với getAccessToken
      localStorage.setItem('gosafe_jwt_token', data.jwtToken);
      localStorage.setItem('jwt_token', data.jwtToken); // Backup
      console.log('JWT token received and stored');
      return data.jwtToken;
    }
    
    throw new Error(data.error || 'No JWT token received from server');
  } catch (error) {
    console.error('Zalo authentication failed:', error);
    
    // Fallback: tạo fake token để test
    console.log('Using fallback fake token for development');
    const fakeToken = 'fake-jwt-token-for-dev-' + Date.now();
    localStorage.setItem('gosafe_jwt_token', fakeToken);
    localStorage.setItem('jwt_token', fakeToken);
    return fakeToken;
  }
};

// Sửa hàm này để consistent
export const getStoredJWTToken = () => {
  try {
    // Dùng cùng logic với getAccessToken
    const token = localStorage.getItem('gosafe_jwt_token') || localStorage.getItem('jwt_token');
    console.log('Retrieved stored JWT token:', token ? 'exists' : 'null');
    return token;
  } catch (error) {
    console.error('Error getting stored JWT token:', error);
    return null;
  }
};