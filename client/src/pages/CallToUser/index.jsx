
import React, { useState } from 'react';
import { Page, Box, Button, Input, Text, useNavigate, Icon } from 'zmp-ui';
import { openPhone } from 'zmp-sdk/apis';
import BottomNavigation from '../../components/BottomNavigation';

const CallToUser = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenPhone = async () => {
    if (!phoneNumber.trim()) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📞 Mở ứng dụng gọi điện với số:', phoneNumber);
      
      await new Promise((resolve, reject) => {
        openPhone({
          phoneNumber: phoneNumber.trim(),
          success: (data) => {
            console.log('✅ openPhone success:', data);
            resolve(data);
          },
          fail: (error) => {
            console.error('❌ openPhone failed:', error);
            reject(error);
          }
        });
      });

    } catch (error) {
      console.error('❌ Lỗi openPhone:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page className="bg-gray-50 min-h-screen flex flex-col">
      {/* Custom Header */}
      <Box style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px', // giảm padding
        paddingTop: 'calc(4px + env(safe-area-inset-top))', // giảm padding top
        backgroundColor: 'white',
        borderBottom: '1px solid #f3f4f6',
        position: 'relative'
      }}>
        <Box
          onClick={handleBack}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            backgroundColor: 'transparent'
          }}
        >
          <Icon icon="zi-chevron-left-header" style={{ fontSize: '30px', color: '#374151' }} />
        </Box>
      </Box>
      
      {/* Centered content container */}
      <Box className="flex-1 flex items-start justify-center px-6 pt-4">
        <Box className="w-full max-w-md space-y-6">
          {/* Hero Section */}
          <Box className="text-center">
            <Box className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Text className="text-3xl">📞</Text>
            </Box>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Gọi điện cho người dùng
            </Text>
            <Text className="text-sm text-gray-500 leading-relaxed">
              Gọi từ app ra số điện thoại bất kỳ
            </Text>
          </Box>

          {/* Input Section */}
          <Box className="space-y-4">
            <Text className="font-semibold text-gray-700 text-center">
              Nhập số điện thoại:
            </Text>
            <Box className="relative">
              <Input
                placeholder="VD: 0987654321"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
                className="w-full text-lg p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 transition-all duration-200 text-center"
                style={{ 
                  fontSize: '18px',
                  height: '60px',
                  fontWeight: '500'
                }}
              />
              <Box className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Text className="text-gray-400">📱</Text>
              </Box>
            </Box>
          </Box>

          {/* Main Call Button */}
          <Button
            onClick={handleOpenPhone}
            disabled={isLoading || !phoneNumber.trim()}
            className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
              isLoading || !phoneNumber.trim() 
                ? 'bg-gray-300 text-gray-500 shadow-none' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
            style={{ height: '60px' }}
          >
            {isLoading ? (
              <Box className="flex items-center justify-center space-x-3">
                <Box className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></Box>
                <Text>Đang mở...</Text>
              </Box>
            ) : (
              <Box className="flex items-center justify-center space-x-3">
                <Text className="text-xl">📞</Text>
                <Text>Mở ứng dụng gọi điện</Text>
              </Box>
            )}
          </Button>
        </Box>
      </Box>

      <BottomNavigation activeTab="call" />
    </Page>
  );
};

export default CallToUser;

