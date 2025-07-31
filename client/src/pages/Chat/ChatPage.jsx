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
          setUserId(res.userInfo.id);
          connectSocket(res.userInfo.id);

          unsub = onMessageReceived((msg) => {
            setMessages((prev) => [...prev, msg]);
          });
        },
        fail: (err) => {
          setUserId(null);
          alert("Không lấy được thông tin người dùng. Vui lòng mở trong Zalo Mini App.");
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
          console.log("Fetch history with:", { userId, targetId });
          const resHistory = await fetch(
            `https://lighting-christmas-emperor-killing.trycloudflare.com/history?from=${userId}&to=${targetId}`
          );
          console.log("resHistory status:", resHistory.status);
          const text = await resHistory.text();
          console.log("resHistory text:", text);

          if (resHistory.ok) {
            try {
              const history = JSON.parse(text);
              setMessages(history);
            } catch (e) {
              console.error("Parse history failed:", e);
              setMessages([]);
            }
          } else {
            console.error("API trả về lỗi:", resHistory.status, text);
            setMessages([]);
          }
        } catch (e) {
          console.error("Load history failed:", e);
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
