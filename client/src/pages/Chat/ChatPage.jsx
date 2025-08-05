import React, { useEffect, useState } from "react";
import { useUserInfo } from "../../contexts/UserContext";
import {
  connectSocket,
  sendMessage,
  onMessageReceived,
  disconnectSocket,
  sendBroadcastMessage,
} from "./socket";
import { Box, Button, Input, Page, Header } from "zmp-ui";
import { authenticateWithZalo, getStoredJWTToken } from '../../utils/auth';

const ADMIN_ID = "3368637342326461234";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const { userInfo, loading } = useUserInfo();

  // Kiểm tra user role từ JWT token
  const getUserRole = () => {
    try {
      const token = getStoredJWTToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      }
    } catch (error) {
      console.error('Error parsing JWT:', error);
    }
    return 'user';
  };
  
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';

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
    if (!input.trim()) return;

    if (isAdmin && isBroadcast) {
      // Gửi broadcast message
      sendBroadcastMessage(input);
      setMessages(prev => [...prev, {
        from: userId,
        message: input,
        type: 'admin_broadcast',
        timestamp: new Date()
      }]);
    } else {
      // Gửi message thường
      if (!targetId) return;
      const msg = { from: userId, to: targetId, message: input };
      sendMessage(msg);
      setMessages(prev => [...prev, msg]);
    }
    
    setInput("");
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
      <Header title={`Chat ${isAdmin ? '(Admin)' : ''}`} />
      
      <Box style={{ padding: "20px" }}>
        {/* Admin broadcast toggle */}
        {isAdmin && (
          <Box style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
              />
              Gửi thông báo toàn hệ thống
            </label>
          </Box>
        )}
        
        {/* Messages display */}
        <Box style={{ overflowY: "auto", marginBottom: "10px" }}>
          {messages.map((m, i) => (
            <Box key={i} style={{
              padding: "8px",
              margin: "4px 0",
              backgroundColor: m.type === 'admin_broadcast' ? '#fff3cd' : '#f8f9fa',
              borderRadius: "8px"
            }}>
              <Box>{m.message}</Box>
              <Box style={{ fontSize: "12px", color: "#666" }}>
                {m.type === 'admin_broadcast' ? '📢 Thông báo hệ thống' : 
                 m.from === userId ? 'Bạn' : 'Người dùng'}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input area */}
        <Box style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder={isBroadcast ? "Nhập thông báo hệ thống..." : "Nhập tin nhắn..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button onClick={handleSend}>
            {isBroadcast ? "📢 Gửi thông báo" : "Gửi"}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default ChatPage;
