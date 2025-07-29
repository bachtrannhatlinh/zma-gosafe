import React, { useState, useEffect } from 'react';
import { Page, Header, List, Box, Text, Avatar } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { useServerAuth } from '../../hooks/useServerAuth';

const ChatListPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useServerAuth();
  const { onlineUsers, isConnected } = useChat(userInfo);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (userInfo?.phone) {
      loadConversations();
    }
  }, [userInfo]);

  const loadConversations = async () => {
    try {
      const SERVER_URL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';
        
      const response = await fetch(
        `${SERVER_URL}/api/chat/conversations/${userInfo.phone}`
      );
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('❌ Load conversations error:', error);
    }
  };

  const startNewChat = (user) => {
    navigate(`/chat/${user.userId}`);
  };

  return (
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
                  onClick={() => startNewChat(user)}
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
                  onClick={() => navigate(`/chat/${conv._id}`)}
                  prefix={
                    <Avatar size={40}>
                      {conv.lastMessage.senderName.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={conv.lastMessage.senderName}
                  subtitle={conv.lastMessage.content}
                  suffix={
                    <Box className="text-right">
                      <Text size="xSmall" className="text-gray-500">
                        {new Date(conv.lastMessage.timestamp).toLocaleDateString()}
                      </Text>
                      {conv.unreadCount > 0 && (
                        <Box className="bg-red-500 text-white rounded-full px-2 py-1 text-xs mt-1">
                          {conv.unreadCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
              ))}
            </List>
          </Box>
        )}

        {onlineUsers.length === 0 && conversations.length === 0 && (
          <Box className="text-center py-8">
            <Text className="text-gray-500">
              Chưa có cuộc trò chuyện nào
            </Text>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ChatListPage;