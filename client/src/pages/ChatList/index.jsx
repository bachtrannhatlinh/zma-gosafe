import React, { useState, useEffect } from 'react';
import { Page, Header, List, Box, Text, Avatar, Button } from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { useChat } from '../../hooks/useChat';
import { useServerAuth } from '../../hooks/useServerAuth';
import ErrorBoundary from '../../components/ErrorBoundary';

const ChatListPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useServerAuth();
  const { onlineUsers, isConnected } = useChat(userInfo);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 ChatList Debug - userInfo:', userInfo);
    if (userInfo?.phone) {
      loadConversations();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const SERVER_URL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';
        
      console.log('🔍 Loading conversations from:', SERVER_URL);
      
      const response = await fetch(
        `${SERVER_URL}/api/chat/conversations/${userInfo.phone}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📱 Conversations response:', data);
      
      if (data.success) {
        setConversations(data.conversations || []);
      } else {
        throw new Error(data.error || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('❌ Load conversations error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  // Error state
  if (error) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text className="text-red-500 mb-4">Lỗi: {error}</Text>
          <Button onClick={loadConversations}>Thử lại</Button>
        </Box>
      </Page>
    );
  }

  // No user info
  if (!userInfo?.phone) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text>Cần đăng nhập để sử dụng chat</Text>
        </Box>
      </Page>
    );
  }

  return (
    <ErrorBoundary>
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        
        <Box className="p-4">
          {/* Connection Status */}
          <Box className="mb-4">
            <Text className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '🟢 Đã kết nối' : '🔴 Mất kết nối'}
            </Text>
          </Box>

          {/* Online Users */}
          {onlineUsers.length > 0 && (
            <Box className="mb-6">
              <Text.Title size="small" className="mb-2">
                Người dùng đang online ({onlineUsers.length})
              </Text.Title>
              <List>
                {onlineUsers.map((user) => (
                  <List.Item
                    key={user.userId}
                    onClick={() => navigate(`/chat/${user.userId}`)}
                    prefix={
                      <Avatar size={40}>
                        {user.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={user.userName}
                    subtitle={`📱 ${user.userPhone}`}
                    suffix={<Text className="text-green-500 text-xs">🟢 Online</Text>}
                  />
                ))}
              </List>
            </Box>
          )}

          {/* Recent Conversations */}
          {conversations.length > 0 && (
            <Box>
              <Text.Title size="small" className="mb-2">
                Cuộc trò chuyện gần đây
              </Text.Title>
              <List>
                {conversations.map((conv) => (
                  <List.Item
                    key={conv._id}
                    onClick={() => {
                      const partnerId = conv.participants?.find(p => p !== userInfo.phone);
                      if (partnerId) {
                        navigate(`/chat/${partnerId}`);
                      }
                    }}
                    prefix={
                      <Avatar size={40}>
                        {conv.lastMessage?.senderName?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    }
                    title={conv.lastMessage?.senderName || 'Unknown'}
                    subtitle={conv.lastMessage?.content || 'No messages'}
                  />
                ))}
              </List>
            </Box>
          )}

          {/* Empty state */}
          {onlineUsers.length === 0 && conversations.length === 0 && (
            <Box className="text-center py-8">
              <Text className="text-gray-500">
                Chưa có cuộc trò chuyện nào
              </Text>
            </Box>
          )}
        </Box>
      </Page>
    </ErrorBoundary>
  );
};

export default ChatListPage;
