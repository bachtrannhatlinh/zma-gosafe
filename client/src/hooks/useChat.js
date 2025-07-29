import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';

export const useChat = (userInfo) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userInfo?.phone) return;

    // Initialize socket connection
    socketRef.current = io(SERVER_URL);
    setSocket(socketRef.current);

    socketRef.current.on('connect', () => {
      console.log('💬 Connected to chat server');
      setIsConnected(true);
      
      // Register user as online
      socketRef.current.emit('user-online', {
        userId: userInfo.phone,
        userName: userInfo.name || 'User',
        userPhone: userInfo.phone
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('💬 Disconnected from chat server');
      setIsConnected(false);
    });

    socketRef.current.on('users-online', (users) => {
      setOnlineUsers(users.filter(u => u.userId !== userInfo.phone));
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('message-sent', (response) => {
      if (response.success) {
        console.log('✅ Message sent successfully');
      }
    });

    socketRef.current.on('message-error', (error) => {
      console.error('❌ Message error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userInfo]);

  const sendMessage = (receiverId, content, messageType = 'text') => {
    if (!socketRef.current || !isConnected) {
      console.error('❌ Not connected to chat server');
      return;
    }

    const messageData = {
      senderId: userInfo.phone,
      senderName: userInfo.name || 'User',
      senderPhone: userInfo.phone,
      receiverId,
      content,
      messageType
    };

    socketRef.current.emit('send-message', messageData);
    
    // Add to local messages immediately
    setMessages(prev => [...prev, {
      ...messageData,
      timestamp: new Date(),
      _id: Date.now().toString()
    }]);
  };

  const loadMessages = async (partnerId, page = 1) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/chat/messages/${userInfo.phone}/${partnerId}?page=${page}`
      );
      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setMessages(data.messages);
        } else {
          setMessages(prev => [...data.messages, ...prev]);
        }
        return data.hasMore;
      }
    } catch (error) {
      console.error('❌ Load messages error:', error);
    }
    return false;
  };

  return {
    socket: socketRef.current,
    messages,
    onlineUsers,
    isConnected,
    sendMessage,
    loadMessages,
    setMessages
  };
};