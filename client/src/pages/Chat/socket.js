// socket.js
import { io } from "socket.io-client";

const socket = io("https://hurt-resident-medicines-photograph.trycloudflare.com", {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", userId); // Tham gia room
  }
};

export const sendMessage = ({ from, to, message }) => {
  socket.emit("chat message", { from, to, message });
};

export const onMessageReceived = (callback) => {
  socket.on("chat message", callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
