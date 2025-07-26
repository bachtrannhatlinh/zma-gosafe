import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from 'zmp-ui';
import { useStringee } from '../hooks/useStringee';

const StringeeDemo = () => {
  const [phoneNumber, setPhoneNumber] = useState('0987654321');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use actual Stringee hook with error handling
  const { 
    isConnected, 
    currentCall, 
    callState, 
    sdkLoaded, 
    error, 
    makeCall, 
    answerCall, 
    hangupCall, 
    retry 
  } = useStringee();

  // Handle demo call with actual Stringee
  const handleDemoCall = () => {
    if (!sdkLoaded) {
      alert('Stringee SDK chưa load xong, vui lòng đợi!');
      return;
    }
    
    if (!isConnected) {
      alert('Vui lòng đợi kết nối Stringee!');
      return;
    }
    
    if (!phoneNumber.trim()) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }
    
    makeCall(phoneNumber);
  };

  // Handle hangup
  const handleHangup = () => {
    hangupCall();
  };

  const getCallStateText = () => {
    switch (callState) {
      case 'calling': return '📞 Đang gọi...';
      case 'ringing': return '📳 Cuộc gọi đến';
      case 'answered': return '✅ Đang trong cuộc gọi';
      case 'ended': return '❌ Cuộc gọi kết thúc';
      default: return '📱 Sẵn sàng gọi';
    }
  };

  return (
    <Box className="p-4 space-y-4">
      {/* Error Display */}
      {error && (
        <Box className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-800 font-semibold mb-2">❌ Lỗi kết nối</Text>
          <Text className="text-red-600 text-sm mb-3">{error}</Text>
          <Button
            onClick={retry}
            size="small"
            className="bg-red-500 text-white"
          >
            🔄 Thử lại
          </Button>
        </Box>
      )}

      {/* Connection Status */}
      <Box className="text-center p-3 border rounded-lg bg-white">
        <Text className="font-bold mb-2">🔗 Trạng thái Stringee</Text>
        <Box className="space-y-2">
          <Box className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
            sdkLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {sdkLoaded ? '✅ SDK đã load' : '🔄 Đang load SDK...'}
          </Box>
          <br/>
          <Box className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
            isConnected ? 'bg-green-100 text-green-800' :
            error ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {isConnected && '✅ Đã kết nối'}
            {!isConnected && !error && '🔄 Đang kết nối...'}
            {error && '❌ Lỗi kết nối'}
          </Box>
        </Box>
      </Box>

      {/* Call Status */}
      {callState !== 'idle' && (
        <Box className="text-center p-3 bg-blue-50 rounded-lg">
          <Text className="font-semibold text-blue-800">
            {getCallStateText()}
          </Text>
          {currentCall && (
            <Text className="text-sm text-blue-600 mt-1">
              📞 {phoneNumber}
            </Text>
          )}
        </Box>
      )}

      {/* Demo Controls */}
      <Box className="space-y-3">
        <Text className="font-semibold">📞 Demo Gọi điện thật</Text>
        
        <Input
          placeholder="Nhập số điện thoại (VD: 0987654321)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          className="text-lg p-3"
          style={{ fontSize: '16px' }}
        />

        {callState === 'idle' ? (
          <Button
            onClick={handleDemoCall}
            disabled={!isConnected || !sdkLoaded}
            className="w-full bg-green-500 text-white py-3 text-lg"
          >
            {!sdkLoaded ? '🔄 Đang load SDK...' : 
             !isConnected ? '🔄 Đang kết nối...' : 
             '📞 Gọi điện ngay'}
          </Button>
        ) : (
          <Box className="flex gap-2">
            {callState === 'ringing' && (
              <Button
                onClick={answerCall}
                className="flex-1 bg-green-500 text-white py-3"
              >
                ✅ Trả lời
              </Button>
            )}
            <Button
              onClick={hangupCall}
              className="flex-1 bg-red-500 text-white py-3"
            >
              ❌ Kết thúc
            </Button>
          </Box>
        )}
      </Box>

      {/* Debug Info */}
      <Box className="bg-gray-50 p-2 rounded-lg">
        <Text className="text-xs text-gray-600">
          🔧 Debug: SDK={sdkLoaded.toString()} | Connected={isConnected.toString()} | State={callState}
        </Text>
      </Box>
    </Box>
  );
};

export default StringeeDemo;


