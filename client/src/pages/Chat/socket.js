// socket.js
import { io } from "socket.io-client";
import { getAccessToken } from "zmp-sdk/apis";

let socket = null;
let jwtToken = null;

// Hàm lấy JWT token từ server
const getJWTToken = async () => {
  if (jwtToken) return jwtToken;
  
  try {
    // Lấy Zalo access token
    const zaloTokenResult = await new Promise((resolve, reject) => {
      getAccessToken({ 
        success: resolve, 
        fail: reject 
      });
    });
    
    const zaloAccessToken = zaloTokenResult.accessToken;
    console.log('Zalo accessToken:', zaloAccessToken);
    
    // Đổi thành JWT token
    const response = await fetch("https://kansas-door-factors-swiss.trycloudflare.com/auth/zalo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessToken: zaloAccessToken })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get JWT token');
    }
    
    const data = await response.json();
    jwtToken = data.token;
    
    // Lưu token để sử dụng cho API calls
    localStorage.setItem('jwt_token', jwtToken);
    
    return jwtToken;
    
  } catch (error) {
    console.error('Error getting JWT token:', error);
    throw error;
  }
};

export const connectSocket = async (userId) => {
  try {
    const token = await getJWTToken();
    
    socket = io("https://kansas-door-factors-swiss.trycloudflare.com", {
      auth: {
        token: token // Sử dụng JWT token
      }
    });

    socket.emit("join", userId);
    
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });
    
  } catch (error) {
    console.error("❌ Error connecting socket:", error);
  }
};

// Export hàm để sử dụng cho API calls
export const getStoredJWTToken = () => {
  return localStorage.getItem('jwt_token') || jwtToken;
};

export const sendMessage = (msg) => {
  try {
    if (socket.connected) {
      socket.emit("send-message", msg);
    } else {
      console.error('Socket not connected, cannot send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const onMessageReceived = (cb) => {
  const handler = (msg) => {
    try {
      if (msg && typeof msg === 'object') {
        cb(msg);
      }
    } catch (error) {
      console.error('Error handling received message:', error);
    }
  };
  
  socket.on("receive-message", handler);
  return () => socket.off("receive-message", handler);
};

export const disconnectSocket = () => {
  try {
    if (socket.connected) {
      socket.disconnect();
    }
  } catch (error) {
    console.error('Error disconnecting socket:', error);
  }
};