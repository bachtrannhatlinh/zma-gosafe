import React, { useEffect, useState } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
} from "./socket";

import { useUserData } from "../../hooks/useUserData";

const ADMIN_ID = "3368637342326461234";
const SERVER_URL = "https://cent-identifier-eos-ld.trycloudflare.com"

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userInfo } = useUserData();

  const isAdmin = userId === ADMIN_ID;

  useEffect(() => {
    let unsub = () => {};
    // Nếu đã có userInfo.id thì chỉ cần setUserId và connectSocket
    if (userInfo?.id) {
      setUserId(userInfo.id);
      connectSocket(userInfo.id);

      unsub = onMessageReceived((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    } else {
      // Nếu chưa có thì mới gọi getUserInfo
      getUserInfo({
        success: async (res) => {
          console.log("getUserInfo success:", res); 
          setUserId(res.userInfo.id);
          connectSocket(res.userInfo.id);

          unsub = onMessageReceived((msg) => {
            setMessages((prev) => [...prev, msg]);
          });
        },
        fail: (err) => {
          setUserId(null);
          console.error("getUserInfo error:", err);
        },
      });
    }

    return () => {
      disconnectSocket();
      unsub && unsub();
    };
    // Chỉ phụ thuộc userInfo, KHÔNG phụ thuộc targetId để tránh gọi lại nhiều lần
  }, [userInfo]);

  // Lấy lịch sử chat khi userId và targetId đã sẵn sàng
  useEffect(() => {
    const fetchHistory = async () => {
      if (userId && targetId) {
        try {
          const resHistory = await fetch(
            `${SERVER_URL}/history?from=${userId}&to=${targetId}`
          );
          const history = await resHistory.json();
          setMessages(history);
        } catch (e) {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };
    fetchHistory();
  }, [userId, targetId]);

  useEffect(() => {
    // Nếu không phải admin thì tự động gán targetId là ADMIN_ID
    if (!isAdmin) {
      setTargetId(ADMIN_ID);
    }
  }, [isAdmin]);

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
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((m, i) => {
          const isMine = m.from === userId;
          const isAdminMsg = m.from === ADMIN_ID;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: isMine ? "row-reverse" : "row",
                alignItems: "flex-end",
              }}
            >
              {/* Avatar giả lập */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isAdminMsg ? "#fb923c" : "#3b82f6",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                  margin: "0 8px",
                }}
              >
                {isAdminMsg ? "A" : "U"}
              </div>
              <div
                style={{
                  background: isMine
                    ? "#d1fae5"
                    : isAdminMsg
                    ? "#fde68a"
                    : "#e5e7eb",
                  borderRadius: 12,
                  padding: "8px 14px",
                  maxWidth: "70%",
                  color: "#222",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 15, marginBottom: 2 }}>{m.message}</div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {isAdminMsg
                    ? isMine
                      ? "Bạn (Admin)"
                      : "Quản trị viên"
                    : isMine
                    ? "Bạn"
                    : "Người dùng"}
                </div>
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
