import React, { useState } from 'react';
import { Page, Box, Button, Text, Header } from 'zmp-ui';
import { getPhoneNumber, authorize } from 'zmp-sdk/apis';
import { useServerAuth } from '../../hooks/useServerAuth';

const PhoneNumberDemo = () => {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);
  const [phoneResult, setPhoneResult] = useState(null);
  const [serverResult, setServerResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { sendTokenToServer } = useServerAuth();

  // Step 1: Request permission and get token
  const handleStep1 = async () => {
    setLoading(true);
    try {
      console.log('🔐 Step 1: Requesting phone permission...');
      
      // First authorize
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: resolve,
          fail: reject,
        });
      });
      
      console.log('✅ Authorization success:', authResult);
      
      // Then get phone number (with token)
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: resolve,
          fail: reject,
        });
      });
      
      console.log('✅ Phone result:', phoneResult);
      setToken(phoneResult.token || phoneResult);
      setPhoneResult(phoneResult);
      setStep(2);
      
    } catch (error) {
      console.error('❌ Step 1 failed:', error);
      alert('Lỗi Step 1: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send token to server
  const handleStep2 = async () => {
    if (!token) {
      alert('Không có token để gửi!');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🚀 Step 2: Sending token to server...');
      const result = await sendTokenToServer(token);
      setServerResult(result);
      setStep(3);
    } catch (error) {
      console.error('❌ Step 2 failed:', error);
      alert('Lỗi Step 2: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setToken(null);
    setPhoneResult(null);
    setServerResult(null);
  };

  return (
    <Page>
      <Header title="Phone Number Flow Demo" />
      
      <Box className="p-4 space-y-6">
        {/* Flow Steps */}
        <Box className="bg-blue-50 p-4 rounded-lg">
          <Text className="font-bold mb-2">📋 Flow theo tài liệu Zalo:</Text>
          <Text className="text-sm space-y-1">
            1. Mini App → getPhoneNumber() → Popup xin quyền<br/>
            2. Callback với token → Gửi token lên server<br/>
            3. Server → Zalo Open API → Lấy thông tin chi tiết
          </Text>
        </Box>

        {/* Current Step */}
        <Box className="text-center">
          <Text className="text-2xl font-bold">
            Step {step}/3
          </Text>
        </Box>

        {/* Step 1 */}
        {step === 1 && (
          <Box className="space-y-4">
            <Text className="font-bold">🔐 Step 1: Xin quyền và lấy token</Text>
            <Button
              onClick={handleStep1}
              loading={loading}
              className="w-full bg-blue-500 text-white"
            >
              Bắt đầu - getPhoneNumber()
            </Button>
          </Box>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Box className="space-y-4">
            <Text className="font-bold">🚀 Step 2: Gửi token lên server</Text>
            
            <Box className="bg-green-50 p-3 rounded">
              <Text className="text-sm font-bold">✅ Token nhận được:</Text>
              <Text className="text-xs break-all mt-1">
                {JSON.stringify(phoneResult, null, 2)}
              </Text>
            </Box>
            
            <Button
              onClick={handleStep2}
              loading={loading}
              className="w-full bg-green-500 text-white"
            >
              Gửi token lên server
            </Button>
          </Box>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Box className="space-y-4">
            <Text className="font-bold">📱 Step 3: Kết quả từ server</Text>
            
            <Box className="bg-yellow-50 p-3 rounded">
              <Text className="text-sm font-bold">📊 Server response:</Text>
              <Text className="text-xs break-all mt-1">
                {JSON.stringify(serverResult, null, 2)}
              </Text>
            </Box>
            
            {serverResult?.phoneNumber && (
              <Box className="bg-green-100 p-3 rounded text-center">
                <Text className="font-bold text-green-800">
                  📞 Số điện thoại: {serverResult.phoneNumber}
                </Text>
              </Box>
            )}
            
            <Button
              onClick={reset}
              className="w-full bg-gray-500 text-white"
            >
              🔄 Test lại từ đầu
            </Button>
          </Box>
        )}

        {/* Debug Info */}
        <Box className="bg-gray-50 p-3 rounded text-xs">
          <Text className="font-bold">🔍 Debug Info:</Text>
          <Text>Current Step: {step}</Text>
          <Text>Has Token: {!!token}</Text>
          <Text>Loading: {loading}</Text>
        </Box>
      </Box>
    </Page>
  );
};

export default PhoneNumberDemo;