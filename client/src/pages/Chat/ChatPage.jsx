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
import {
  authenticateWithZalo,
  getStoredJWTToken,
  isTokenValid,
} from "../../utils/auth";

const ADMIN_ID = "3368637342326461234";

const ChatPage = () => {
  const [userId, setUserId] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting, connected, offline
  const { userInfo, loading } = useUserInfo();

  // Cập nhật getUserRole để kiểm tra token validity
  const getUserRole = () => {
    try {
      if (!isTokenValid()) {
        return "user";
      }

      const token = getStoredJWTToken();
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || "user";
      }
    } catch (error) {
      console.error("Error parsing JWT:", error);
    }
    return "user";
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  useEffect(() => {
    let unsub = () => {};
    let statusCheckInterval = null;
    let isMounted = true; // Thêm flag để track mount status

    // Sửa logic lấy userInfo - bỏ .userInfo vì đã có trong context
    if (!loading && userInfo?.userInfo?.id) {
      setUserId(userInfo.userInfo.id); // "8411142294954674476"

      const initializeChat = async () => {
        try {
          console.log("Initializing chat with user info:", userInfo);

          // Thử lấy token đã lưu
          let token = getStoredJWTToken();
          console.log("Stored token:", token ? "Found" : "null");

          // Nếu không có token, gửi user info lên server để lấy JWT
          if (!token && isMounted) {
            console.log(
              "No stored token, authenticating with Zalo user info..."
            );
            token = await authenticateWithZalo(userInfo.userInfo);
            console.log("New token:", token ? "Success" : "Failed");
          }

          if (token && isMounted) {
            console.log("✅ Token available, connecting socket...");
            console.log(
              "Connecting socket with user ID:",
              userInfo.userInfo.id
            );

            // Kết nối socket và cập nhật status
            const connectResult = await connectSocket(userInfo.userInfo.id, token);
            
            if (isMounted) {
              if (connectResult) {
                setConnectionStatus("connected");
              } else {
                setConnectionStatus("offline");
              }
            }

            unsub = onMessageReceived((msg) => {
              if (msg && typeof msg === "object" && isMounted) {
                setMessages((prev) =>
                  Array.isArray(prev) ? [...prev, msg] : [msg]
                );
              }
            });
          } else if (isMounted) {
            console.error("❌ No JWT token - cannot connect to chat server");
            setConnectionStatus("offline");
          }
        } catch (error) {
          console.error("❌ Chat initialization failed:", error);
          if (isMounted) {
            setConnectionStatus("offline");
          }
        }
      };

      initializeChat();
    }

    return () => {
      isMounted = false; // Set flag to false when unmounting
    
      // Cleanup socket connection properly
      try {
        disconnectSocket();
      } catch (error) {
        console.warn("Error during socket disconnect:", error);
      }
      
      // Cleanup message listener
      if (unsub && typeof unsub === 'function') {
        try {
          unsub();
        } catch (error) {
          console.warn("Error during unsub:", error);
        }
      }
      
      // Clear interval
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [userInfo, loading]); // Thêm loading vào dependency

  // Lấy lịch sử chat khi userId và targetId đã sẵn sàng
  useEffect(() => {
    let isMounted = true;
  
    const fetchHistory = async () => {
      if (userId && targetId && isMounted) {
        try {
          const token = getStoredJWTToken();

          if (!token) {
            console.error("No JWT token for history fetch");
            if (isMounted) {
              setMessages([
                {
                  from: "system",
                  message: "Cần kết nối server để tải lịch sử chat. Vui lòng thử lại sau.",
                  timestamp: new Date().toISOString(),
                  type: "error"
                }
              ]);
            }
            return;
          }

          const serverURL = process.env.URL_SERVER || "https://server-gosafe.vercel.app";
          const resHistory = await fetch(
            `${serverURL}/history?from=${userId}&to=${targetId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!resHistory.ok) {
            throw new Error(`HTTP error! status: ${resHistory.status}`);
          }

          const history = await resHistory.json();

          if (isMounted) {
            if (Array.isArray(history)) {
              setMessages(history);
            } else {
              console.warn("History response is not an array:", history);
              setMessages([]);
            }
          }
        } catch (e) {
          console.error("Error fetching chat history:", e);
          if (isMounted) {
            setMessages([
              {
                from: "system",
                message: "Không thể tải lịch sử chat do lỗi kết nối server.",
                timestamp: new Date().toISOString(),
                type: "error"
              }
            ]);
          }
        }
      } else if (isMounted) {
        setMessages([]);
      }
    };
    
    fetchHistory();
    
    return () => {
      isMounted = false;
    };
  }, [userId, targetId]);

  useEffect(() => {
    // Nếu không phải admin thì tự động gán targetId là ADMIN_ID
    if (!isAdmin) {
      setTargetId(ADMIN_ID);
    }
  }, [isAdmin]);

  const handleSend = () => {
    if (!input.trim() || connectionStatus !== "connected") return;

    const timestamp = new Date().toISOString();

    if (isAdmin && isBroadcast) {
      // Gửi broadcast message
      const success = sendBroadcastMessage(input);
      const newMessage = {
        from: userId,
        message: input,
        type: "admin_broadcast",
        timestamp: timestamp,
      };
      
      setMessages((prev) => [...prev, newMessage]);
      
      if (!success) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            from: "system",
            message: "⚠️ Tin nhắn chưa được gửi - lỗi kết nối",
            type: "error",
            timestamp: new Date().toISOString()
          }]);
        }, 1000);
      }
    } else {
      // Gửi message thường
      if (!targetId) return;
      const msg = { from: userId, to: targetId, message: input, timestamp };
      
      // Luôn thêm tin nhắn vào UI trước
      setMessages((prev) => [...prev, msg]);
      
      // Gửi qua socket
      const success = sendMessage(msg);
      if (!success) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            from: "system",
            message: "⚠️ Tin nhắn chưa được gửi - lỗi kết nối",
            type: "error",
            timestamp: new Date().toISOString()
          }]);
        }, 1000);
      }
    }

    setInput("");
  };

  // Rest of component...
  if (loading) {
    return <div>Loading user info...</div>;
  }

  if (!userInfo) {
    return <div>Failed to load user info</div>;
  }

  return (
    <Page>
      <Header title={`Chat ${isAdmin ? "(Admin)" : ""}`} />

      <Box style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh",
        paddingTop: "60px" // Tránh bị header che
      }}>
        {/* Connection status */}
        <Box style={{ 
          padding: "8px 16px", 
          backgroundColor: 
            connectionStatus === "connected" ? "#d4edda" : 
            connectionStatus === "offline" ? "#f8d7da" : "#fff3cd",
          fontSize: "12px",
          borderBottom: "1px solid #ddd"
        }}>
          {connectionStatus === "connected" && "🟢 Đã kết nối server - Sẵn sàng chat"}
          {connectionStatus === "offline" && "🔴 Không thể kết nối server - Chat không khả dụng"}
          {connectionStatus === "connecting" && "🟡 Đang kết nối server..."}
        </Box>

        {/* Admin broadcast toggle */}
        {isAdmin && connectionStatus === "connected" && (
          <Box style={{ 
            padding: "10px 16px", 
            borderBottom: "1px solid #eee",
            backgroundColor: "#f8f9fa"
          }}>
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              📢 Gửi thông báo toàn hệ thống
            </label>
          </Box>
        )}

        {/* Messages display - flex để chiếm hết không gian còn lại */}
        <Box style={{ 
          flex: 1,
          overflowY: "auto", 
          padding: "10px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {connectionStatus === "offline" ? (
            <Box style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              margin: "20px 0"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔌</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
                Không thể kết nối server
              </div>
              <div style={{ fontSize: "14px" }}>
                Chat cần kết nối internet và server để hoạt động. 
                Vui lòng kiểm tra kết nối và thử lại.
              </div>
            </Box>
          ) : (
            messages.map((m, i) => (
              <Box
                key={i}
                style={{
                  padding: "12px",
                  backgroundColor:
                    m.type === "admin_broadcast" ? "#fff3cd" : 
                    m.type === "error" ? "#f8d7da" :
                    m.type === "system" ? "#d1ecf1" : 
                    m.from === userId ? "#007bff20" : "#f8f9fa",
                  borderRadius: "12px",
                  maxWidth: "85%",
                  alignSelf: m.from === userId ? "flex-end" : "flex-start",
                  border: `1px solid ${
                    m.type === "admin_broadcast" ? "#ffeaa7" : 
                    m.type === "error" ? "#f5c6cb" :
                    m.type === "system" ? "#bee5eb" : 
                    m.from === userId ? "#007bff40" : "#e9ecef"
                  }`
                }}
              >
                <Box style={{ 
                  wordBreak: "break-word",
                  fontSize: "14px",
                  lineHeight: "1.4"
                }}>
                  {m.message}
                </Box>
                <Box style={{ 
                  fontSize: "11px", 
                  color: "#666",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>
                    {m.type === "admin_broadcast"
                      ? "📢 Thông báo hệ thống"
                      : m.type === "error" 
                      ? "⚠️ Lỗi hệ thống"
                      : m.type === "system"
                      ? "ℹ️ Hệ thống"
                      : m.from === userId
                      ? "Bạn"
                      : "Người dùng"}
                  </span>
                  {m.timestamp && (
                    <span style={{ opacity: 0.7 }}>
                      {new Date(m.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Input area - cố định ở dưới */}
        <Box style={{ 
          padding: "10px 16px",
          borderTop: "1px solid #eee",
          backgroundColor: connectionStatus === "offline" ? "#f5f5f5" : "#fff",
          display: "flex", 
          gap: "10px",
          alignItems: "center"
        }}>
          <Input
            placeholder={
              connectionStatus === "connecting" 
                ? "Đang kết nối server..."
                : connectionStatus === "offline"
                ? "Cần kết nối server để chat"
                : isBroadcast ? "Nhập thông báo hệ thống..." : "Nhập tin nhắn..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && connectionStatus === "connected") {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ 
              flex: 1,
              padding: "10px 12px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              backgroundColor: connectionStatus === "offline" ? "#f5f5f5" : "#fff"
            }}
            disabled={connectionStatus !== "connected"}
          />
          <Button 
            onClick={handleSend}
            disabled={connectionStatus !== "connected" || !input.trim()}
            style={{
              borderRadius: "20px",
              minWidth: "60px",
              backgroundColor: input.trim() && connectionStatus === "connected" ? "#007bff" : "#ccc"
            }}
          >
            {isBroadcast ? "📢" : "Gửi"}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default ChatPage;
