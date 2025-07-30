import React, { useState, useEffect } from 'react';
import { useNavigate } from "zmp-ui";
import { Page, Header, List, Text, Box, Button, Avatar } from 'zmp-ui';
import { useServerAuth } from '../../hooks/useServerAuth';
import { useChat } from '../../hooks/useChat';
import ErrorBoundary from '../../components/ErrorBoundary';

const ChatListContent = () => {
  const navigate = useNavigate();
  const { userInfo, loading: authLoading, checkAuth } = useServerAuth();
  const { onlineUsers, isConnected } = useChat(userInfo);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverLoading, setServerLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const checkServerHealth = async () => {
    try {
      const SERVER_URL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'https://zma-gosafe-bachtrannhatlinhs-projects.vercel.app';
      
      console.log('🔍 Checking server health:', SERVER_URL);
      
      const response = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (!response.ok) {
        throw new Error(`Server not healthy: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Server health check:', data);
      return true;
    } catch (error) {
      console.error('❌ Server health check failed:', error);
      throw new Error('Server không phản hồi. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    if (!initialized) {
      initializePage();
      setInitialized(true);
    }
  }, [initialized]);

  const initializePage = async () => {
    try {
      setLoading(true);
      console.log('🔍 ChatList: Initializing...');
      
      await checkServerHealth();
      const authResult = await checkAuth();
      
      if (authResult?.phone) {
        await loadConversations(authResult.phone);
      }
    } catch (error) {
      console.error('❌ ChatList init error:', error);
      setError(error.message || 'Có lỗi xảy ra khi khởi tạo');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async (userPhone) => {
    try {
      setServerLoading(true);
      
      const SERVER_URL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'https:/zma-gosafe-bachtrannhatlinhs-projects.vercel.app';
        
      console.log('🔍 Loading conversations for:', userPhone);
      
      const response = await fetch(
        `${SERVER_URL}/api/chat/conversations/${userPhone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations || []);
        console.log('✅ Conversations loaded:', data.conversations?.length || 0);
      } else {
        throw new Error(data.error || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('❌ Load conversations error:', error);
      setError(`Không thể tải danh sách chat: ${error.message}`);
    } finally {
      setServerLoading(false);
    }
  };

  if (loading || authLoading || serverLoading) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text>
            {authLoading ? 'Đang xác thực...' : 
             serverLoading ? 'Đang tải danh sách chat...' : 
             'Đang tải...'}
          </Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text className="text-red-500 mb-4">Lỗi: {error}</Text>
          <Button onClick={initializePage}>Thử lại</Button>
        </Box>
      </Page>
    );
  }

  if (!userInfo?.phone) {
    return (
      <Page>
        <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
        <Box className="p-4 text-center">
          <Text className="mb-4">Cần đăng nhập để sử dụng chat</Text>
          <Button onClick={() => navigate('/')}>
            Về trang chủ để đăng nhập
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page>
      <Header title="Chat" showBackIcon onBack={() => navigate('/')} />
      
      <Box className="p-4">
        <Box className="mb-4">
          <Text className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? '🟢 Đã kết nối' : '🔴 Mất kết nối'}
          </Text>
        </Box>

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
      </Box>
    </Page>
  );
};

const ChatListPage = () => {
  return (
    <ErrorBoundary>
      <ChatListContent />
    </ErrorBoundary>
  );
};

export default ChatListPage;
