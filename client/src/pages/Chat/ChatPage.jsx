import React, { useEffect, useState } from "react";
import { useUserInfo } from "../../contexts/UserContext";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
  getStoredJWTToken,
} from "./socket";
import { Box, Button, Input, Page, Header } from "zmp-ui";

const ADMIN_ID = "3368637342326461234";
const SERVER_URL = "https://kansas-door-factors-swiss.trycloudflare.com";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userInfo } = useUserInfo();

  console.log("💬 ChatPage userInfo:", userInfo);

  const isAdmin = userId === ADMIN_ID;

  useEffect(() => {
    let unsub = () => {};

    if (userInfo?.userInfo?.id) {
      setUserId(userInfo.userInfo.id);
      connectSocket(userInfo.userInfo.id);

      unsub = onMessageReceived((msg) => {
        if (msg && typeof msg === 'object') {
          setMessages((prev) => Array.isArray(prev) ? [...prev, msg] : [msg]);
        }
      });
    }

    return () => {
      disconnectSocket();
      unsub && unsub();
    };
  }, [userInfo]);

  // Lấy lịch sử chat khi userId và targetId đã sẵn sàng
  useEffect(() => {
    const fetchHistory = async () => {
      if (userId && targetId) {
        try {
          const token = getStoredJWTToken();
          
          const resHistory = await fetch(
            `${SERVER_URL}/history?from=${userId}&to=${targetId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (!resHistory.ok) {
            throw new Error(`HTTP error! status: ${resHistory.status}`);
          }
          
          const history = await resHistory.json();
          
          if (Array.isArray(history)) {
            setMessages(history);
          } else {
            console.warn('History response is not an array:', history);
            setMessages([]);
          }
        } catch (e) {
          console.error('Error fetching chat history:', e);
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
    
    try {
      sendMessage(msg);
      setMessages((prev) => Array.isArray(prev) ? [...prev, msg] : [msg]);
      setInput("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Page>
      <Header title="Live Chat" showBackIcon={true} />

      <Box style={{ padding: "16px", marginTop: "80px" }}>
        <Box>
          <strong>Bạn là:</strong> {userId || "Đang lấy ID..."} (
          {isAdmin ? "Quản trị viên" : "Người dùng"})
        </Box>

        {isAdmin && (
          <Box>
            <Input
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Nhập ID người dùng để trả lời"
            />
          </Box>
        )}

        <Box style={{ overflowY: "auto", marginBottom: "10px" }}>
          {Array.isArray(messages) && messages.map((m, i) => {
            const isMine = m.from === userId;
            const isAdminMsg = m.from === ADMIN_ID;
            return (
              <Box key={i}>
                {/* Avatar giả lập */}
                <Box>{isAdminMsg ? "A" : "U"}</Box>
                <Box>
                  <Box>{m.message}</Box>
                  <Box>
                    {isAdminMsg
                      ? isMine
                        ? "Bạn (Admin)"
                        : "Quản trị viên"
                      : isMine
                      ? "Bạn"
                      : "Người dùng"}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, height: "40px" }}
          />
          <Button onClick={handleSend}>Gửi</Button>
        </Box>
      </Box>
    </Page>
  );
};

export default ChatPage;
