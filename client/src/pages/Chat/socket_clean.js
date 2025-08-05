// socket.js
import { io } from "socket.io-client";
import { getStoredJWTToken } from '../../utils/auth';

let socket = null;
const SERVER_URL = process.env.URL_SERVER || "https://server-gosafe.vercel.app";

// Thêm function để test server trước khi connect socket
export const testServerConnection = async () => {
  try {
    const token = getStoredJWTToken();
    if (!token) return false;
    
    console.log("🧪 Testing server connection...");
    
    // Test với HTTP request trước
    const response = await fetch(`${SERVER_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log("📡 Server HTTP test:", response.status);
    return response.ok;
  } catch (error) {
    console.warn("⚠️ Server HTTP test failed:", error.message);
    return false;
  }
};

export const connectSocket = (userId) => {
  try {
    const token = getStoredJWTToken();
    
    if (!token) {
      console.warn('⚠️ No JWT token available');
      return false;
    }
    
    // Decode token để lấy thông tin user
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userRole = tokenPayload.role;
    
    console.log(`🔌 Attempting to connect to: ${SERVER_URL}`);
    
    socket = io(SERVER_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      timeout: 10000,
      forceNew: true,
      reconnection: false, // Tắt auto reconnection để tránh spam
    });
    
    socket.emit("join", userId);
    
    socket.on("connect", () => {
      console.log(`✅ Socket connected successfully - ID: ${socket.id}`);
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection failed:", error.type || error.message);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });
    
    socket.on("broadcast_message", (message) => {
      console.log("📢 Received broadcast:", message);
    });
    
    // Return true để indicate rằng đã attempt connection
    return true;
    
  } catch (error) {
    console.error("❌ Socket setup failed:", error);
    return false;
  }
};

export const sendBroadcastMessage = (message) => {
  if (socket && socket.connected) {
    socket.emit("message", {
      from: socket.userId,
      message: message,
      broadcast: true,
      timestamp: new Date()
    });
    return true;
  }
  return false;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};

export const onMessageReceived = (callback) => {
  if (socket) {
    socket.on("message", callback);
    socket.on("broadcast_message", callback);
    
    // Return cleanup function
    return () => {
      socket.off("message", callback);
      socket.off("broadcast_message", callback);
    };
  }
  return () => {};
};

export const sendMessage = (messageData) => {
  if (socket && socket.connected) {
    socket.emit("message", messageData);
    return true;
  } else {
    console.warn("⚠️ Cannot send message - socket not connected");
    return false;
  }
};

// Function để check connection status
export const isSocketConnected = () => {
  return socket && socket.connected;
};

// Function để get socket instance (for debugging)
export const getSocket = () => {
  return socket;
};
