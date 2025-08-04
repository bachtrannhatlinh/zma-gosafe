import React, { useEffect, useState } from "react";
import { useUserInfo } from "../../contexts/UserContext";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
} from "./socket";
import { Box, Button, Input, Page, Header } from "zmp-ui";
import { authenticateWithZalo, getStoredJWTToken } from '../../utils/auth';

const ADMIN_ID = "3368637342326461234";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userInfo, loading } = useUserInfo();

  const isAdmin = userId === ADMIN_ID;

  useEffect(() => {
    let unsub = () => {};

    // Sửa logic lấy userInfo - bỏ .userInfo vì đã có trong context
    if (!loading && userInfo?.userInfo?.id) {
      setUserId(userInfo.userInfo.id); // "8411142294954674476"
      
      const initializeChat = async () => {
        try {
          console.log('Initializing chat with user info:', userInfo);
          
          // Thử lấy token đã lưu
          let token = getStoredJWTToken();
          
          // Nếu không có token, gửi user info lên server để lấy JWT
          if (!token) {
            console.log('No stored token, authenticating with Zalo user info...');
            token = await authenticateWithZalo(userInfo); // Truyền flat object
          }
          
          if (token) {
            console.log('Connecting socket with user ID:', userInfo.userInfo.id);
            connectSocket(userInfo.userInfo.id);
            
            unsub = onMessageReceived((msg) => {
              if (msg && typeof msg === 'object') {
                setMessages((prev) => Array.isArray(prev) ? [...prev, msg] : [msg]);
              }
            });
          } else {
            console.error('Failed to get JWT token');
          }
        } catch (error) {
          console.error('Chat initialization failed:', error);
        }
      };
      
      initializeChat();
    }

    return () => {
      disconnectSocket();
      unsub && unsub();
    };
  }, [userInfo, loading]); // Thêm loading vào dependency

  // Lấy lịch sử chat khi userId và targetId đã sẵn sàng
  useEffect(() => {
    const fetchHistory = async () => {
      if (userId && targetId) {
        try {
          const token = getStoredJWTToken();
          
          if (!token) {
            console.error('No JWT token for history fetch');
            return;
          }
          
          const resHistory = await fetch(
            `${process.env.URL_SERVER}/history?from=${userId}&to=${targetId}`,
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

  // Debug log
  useEffect(() => {
    console.log('UserInfo context data:', {
      userInfo,
      loading,
      hasUserId: !!userInfo?.id
    });
  }, [userInfo, loading]);

  // Rest of component...
  if (loading) {
    return <div>Loading user info...</div>;
  }

  if (!userInfo) {
    return <div>Failed to load user info</div>;
  }

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
