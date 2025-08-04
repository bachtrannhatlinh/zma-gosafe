// socket.js
import { io } from "socket.io-client";

let socket = null;
const SERVER_URL = process.env.URL_SERVER || "https://zma-gosafe-bachtrannhatlinhs-projects.vercel.app";

// Import từ auth.js thay vì tự định nghĩa
export { getStoredJWTToken } from '../../utils/auth';

export const connectSocket = (userId) => {
  try {
    // Import getStoredJWTToken từ auth.js
    const { getStoredJWTToken } = require('../../utils/auth');
    const token = getStoredJWTToken();
    
    if (!token) {
      throw new Error('No JWT token available');
    }
    
    socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket']
    });
    
    if (!socket) {
      throw new Error('Failed to create socket instance');
    }
    
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

export const sendMessage = (msg) => {
  try {
    if (socket && socket.connected) {
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
  
  if (socket) {
    socket.on("receive-message", handler);
    return () => socket.off("receive-message", handler);
  }
  
  return () => {}; // Return empty function if no socket
};

export const disconnectSocket = () => {
  try {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    socket = null; // Reset socket instance
  } catch (error) {
    console.error('Error disconnecting socket:', error);
  }
};