import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../config/server';

export const useChat = (userInfo) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('🔍 useChat: Effect triggered with userInfo:', userInfo);
    
    if (!userInfo?.phone) {
      console.log('🔍 useChat: No userInfo.phone, skipping connection');
      return;
    }

    console.log('🔍 useChat: Connecting with userInfo:', userInfo);
    console.log('🔍 useChat: SERVER_URL:', SERVER_URL);

    try {
      // Initialize socket connection
      socketRef.current = io(SERVER_URL, {
        timeout: 10000,
        forceNew: true
      });
      setSocket(socketRef.current);

      socketRef.current.on('connect', () => {
        console.log('💬 Connected to chat server');
        setIsConnected(true);
        setError(null);
        
        // Register user as online
        socketRef.current.emit('user-online', {
          userId: userInfo.phone,
          userName: userInfo.name || 'User',
          userPhone: userInfo.phone
        });
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('💬 Connection error:', err);
        setError(err.message);
        setIsConnected(false);
      });

      socketRef.current.on('disconnect', () => {
        console.log('💬 Disconnected from chat server');
        setIsConnected(false);
      });

      socketRef.current.on('users-online', (users) => {
        console.log('👥 Online users updated:', users);
        setOnlineUsers(users.filter(u => u.userId !== userInfo.phone));
      });

      socketRef.current.on('receive-message', (message) => {
        console.log('📨 Received message:', message);
        setMessages(prev => [...prev, message]);
      });

    } catch (err) {
      console.error('❌ useChat initialization error:', err);
      setError(err.message);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userInfo?.phone]);

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
    socket,
    messages,
    onlineUsers,
    isConnected,
    error,
    setMessages
  };
};
