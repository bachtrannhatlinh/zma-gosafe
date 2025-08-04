import React, { useState } from 'react';
import { Box, Button, Input, Text, Modal } from 'zmp-ui';
import { useStringee } from '../hooks/useStringee';

const StringeeCall = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const { isConnected, currentCall, callState, makeCall, answerCall, hangupCall } = useStringee();

  const handleMakeCall = () => {
    if (!phoneNumber.trim()) {
      return;
    }
    makeCall(phoneNumber);
    setShowCallModal(true);
  };

  const handleHangup = () => {
    hangupCall();
    setShowCallModal(false);
  };

  const getCallStateText = () => {
    switch (callState) {
      case 'calling': return 'Đang gọi...';
      case 'ringing': return 'Cuộc gọi đến';
      case 'answered': return 'Đang trong cuộc gọi';
      case 'ended': return 'Cuộc gọi kết thúc';
      default: return 'Sẵn sàng';
    }
  };

  return (
    <Box className="p-4">
      <Text className="text-lg font-bold mb-4">Stringee Call</Text>
      
      <Box className="mb-4">
        <Text className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? '🟢 Đã kết nối' : '🔴 Chưa kết nối'}
        </Text>
      </Box>

      <Box className="mb-4">
        <Input
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-2"
        />
        <Button
          onClick={handleMakeCall}
          disabled={!isConnected}
          className="w-full"
        >
          📞 Gọi điện
        </Button>
      </Box>

      <Modal
        visible={showCallModal}
        title="Cuộc gọi"
        onClose={() => setShowCallModal(false)}
      >
        <Box className="text-center p-4">
          <Text className="text-lg mb-4">{getCallStateText()}</Text>
          <Text className="mb-4">📞 {phoneNumber}</Text>
          
          <Box className="flex gap-2 justify-center">
            {callState === 'ringing' && (
              <Button onClick={answerCall} className="bg-green-500">
                ✅ Trả lời
              </Button>
            )}
            <Button onClick={handleHangup} className="bg-red-500">
              ❌ Kết thúc
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StringeeCall;