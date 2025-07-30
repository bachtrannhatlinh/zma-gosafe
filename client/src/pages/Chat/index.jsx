import React, { useState, useEffect, useRef } from 'react';
import { Page, Header, List, Input, Button, Box, Text } from 'zmp-ui';
import { useNavigate, useParams } from 'zmp-ui';
import { useChat } from '../../hooks/useChat';
import { useServerAuth } from '../../hooks/useServerAuth';

const ChatPage = () => {
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const { userInfo } = useServerAuth();
  const { messages, sendMessage, loadMessages, isConnected } = useChat(userInfo);
  const [newMessage, setNewMessage] = useState('');
  const [partnerInfo, setPartnerInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (partnerId && userInfo?.phone) {
      loadMessages(partnerId);
      // Set partner info (you might want to fetch this from an API)
      setPartnerInfo({ phone: partnerId, name: `User ${partnerId}` });
    }
  }, [partnerId, userInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !partnerId) return;
    
    sendMessage(partnerId, newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Page className="chat-page">
      <Header 
        title={partnerInfo?.name || 'Chat'}
        showBackIcon
        onBack={() => navigate('/chat-list')}
      />
      
      <Box className="flex flex-col h-full">
        {/* Connection Status */}
        {!isConnected && (
          <Box className="bg-yellow-100 p-2 text-center">
            <Text size="small">Đang kết nối...</Text>
          </Box>
        )}

        {/* Messages List */}
        <Box className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message, index) => {
            const isOwn = message.senderId === userInfo?.phone;
            return (
              <Box
                key={message._id || index}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <Box
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <Text size="small">{message.content}</Text>
                  <Text size="xSmall" className="opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box className="p-4 border-t">
          <Box className="flex space-x-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              variant="primary"
              size="medium"
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default ChatPage;