// socket.js
import { io } from "socket.io-client";
const socket = io("https://cent-identifier-eos-ld.trycloudflare.com", { autoConnect: true });

export const connectSocket = (userId) => {
  socket.emit("join", userId);
};

export const sendMessage = (msg) => {
  socket.emit("send-message", msg);
};

export const onMessageReceived = (cb) => {
  socket.on("receive-message", cb);
  return () => socket.off("receive-message", cb);
};

export const disconnectSocket = () => {
  socket.disconnect();
};