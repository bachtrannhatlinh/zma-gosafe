import React, { useEffect, useState } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
} from "./socket";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState(""); // Chọn người nhận
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getUserInfo({
      success: (res) => {
        const uid = res.userInfo.id;
        setUserId(uid);
        connectSocket(uid); // kết nối vào socket room của mình

        onMessageReceived((msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      },
    });

    return () => disconnectSocket();
  }, []);

  const handleSend = () => {
    if (!targetId || !input.trim()) return;

    const msg = { from: userId, to: targetId, message: input };
    sendMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div style={{ padding: 16, background: "#fff", minHeight: "100vh" }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Bạn là:</strong> {userId || "Đang lấy ID..."}
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="Nhập ID người nhận"
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      </div>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 8,
          marginBottom: 16,
          padding: 8,
          background: "#f9f9f9",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.from === userId ? "right" : "left",
              margin: "4px 0",
              padding: "4px 8px",
              background: m.from === userId ? "#d1fae5" : "#e5e7eb",
              borderRadius: 8,
              display: "inline-block",
              maxWidth: "80%",
              color: "#222",
            }}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            flex: 1,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            background: "#fb923c",
            color: "#fff",
            fontWeight: "bold",
          }}
          onClick={handleSend}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
