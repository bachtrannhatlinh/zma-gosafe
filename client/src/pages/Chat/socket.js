// socket.js
import { io } from "socket.io-client";

const socket = io("https://kansas-door-factors-swiss.trycloudflare.com", { 
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
});

// Error handling
socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export const connectSocket = (userId) => {
  try {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join", userId);
    console.log(`Socket connected for user: ${userId}`);
  } catch (error) {
    console.error('Error connecting socket:', error);
  }
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