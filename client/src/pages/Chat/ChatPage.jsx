import React, { useEffect, useState } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
} from "./socket";

const ADMIN_ID = "3368637342326461234";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState(""); // Đối tượng đang chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const isAdmin = userId === ADMIN_ID;

useEffect(() => {
  getUserInfo({
    success: async (res) => {
      const uid = res.userInfo.id;
      setUserId(uid);
      connectSocket(uid);

      // Load lịch sử chat
      const resHistory = await fetch(
        `https://https://lighting-christmas-emperor-killing.trycloudflare.com/history?from=${uid}&to=${targetId}`
      );
      const history = await resHistory.json();
      setMessages(history);

      onMessageReceived((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
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
    <div
      style={{
        paddingTop: "max(env(safe-area-inset-top), 44px)",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>Bạn là:</strong> {userId || "Đang lấy ID..."} (
        {isAdmin ? "Quản trị viên" : "Người dùng"})
      </div>

      {isAdmin && (
        <div style={{ marginBottom: 12 }}>
          <input
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="Nhập ID người dùng để trả lời"
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
      )}

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
        {messages.map((m, i) => {
          const isMine = m.from === userId;
          return (
            <div
              key={i}
              style={{
                textAlign: isMine ? "right" : "left",
                margin: "4px 0",
                padding: "6px 12px",
                background: isMine ? "#d1fae5" : "#e5e7eb",
                borderRadius: 12,
                display: "inline-block",
                maxWidth: "80%",
                color: "#222",
              }}
            >
              <div style={{ fontSize: 14 }}>{m.message}</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                {isMine ? "Bạn" : m.from}
              </div>
            </div>
          );
        })}
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
