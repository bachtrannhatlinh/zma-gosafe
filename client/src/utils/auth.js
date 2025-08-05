import { getUserInfo } from "zmp-sdk/apis";

// Thêm fallback server cho development
const getServerURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.URL_SERVER_LOCAL || 'http://localhost:5000';
  }
  return process.env.URL_SERVER || "https://server-gosafe.vercel.app";
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

// Thêm các function quản lý JWT token
export const getStoredJWTToken = () => {
  try {
    const token = localStorage.getItem('gosafe_jwt_token');
    return token;
  } catch (error) {
    console.error('❌ Error getting JWT token:', error);
    return null;
  }
};

export const setStoredJWTToken = (token) => {
  try {
    localStorage.setItem('gosafe_jwt_token', token);
    console.log('✅ JWT token stored successfully');
    return true;
  } catch (error) {
    console.error('❌ Error storing JWT token:', error);
    return false;
  }
};

export const removeStoredJWTToken = () => {
  try {
    localStorage.removeItem('gosafe_jwt_token');
    console.log('🗑️ JWT token removed');
    return true;
  } catch (error) {
    console.error('❌ Error removing JWT token:', error);
    return false;
  }
};

// Đảm bảo function authenticateWithZalo đúng format:
export const authenticateWithZalo = async (userInfo) => {
  try {
    console.log('🔐 Authenticating with Zalo user info:', userInfo);
    
    const serverURL = process.env.URL_SERVER || "https://server-gosafe.vercel.app";
    console.log('🌐 Using server URL:', serverURL);
    
    const payload = {
      id: userInfo.id,
      name: userInfo.name,
      avatar: userInfo.avatar,
    };
    
    console.log('📤 Sending payload:', payload);
    
    const response = await fetch(`${serverURL}/auth/zalo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.success && data.jwtToken) {
      setStoredJWTToken(data.jwtToken);
      console.log('✅ JWT token saved successfully');
      return data.jwtToken;
    } else {
      throw new Error(data.error || 'Authentication failed');
    }
    
  } catch (error) {
    console.error('❌ authenticateWithZalo failed:', error);
    return null;
  }
};

// Function kiểm tra JWT token có hợp lệ không
export const isTokenValid = () => {
  try {
    const token = getStoredJWTToken();
    if (!token) return false;
    
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Kiểm tra expiry
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.log('⚠️ JWT token expired');
      removeStoredJWTToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error validating token:', error);
    removeStoredJWTToken();
    return false;
  }
};