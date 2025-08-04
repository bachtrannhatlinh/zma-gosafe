import React, { useState } from 'react';
import { Page, Box, Button, Text } from 'zmp-ui';
import { useUserInfo } from '../../contexts/UserContext';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/PageHeader';

const JWTTest = () => {
  const { userInfo } = useUserInfo();
  const { request, loading } = useApi();
  const [testResult, setTestResult] = useState(null);
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false
  });

  // Load auth state from localStorage
  React.useEffect(() => {
    try {
      const token = localStorage.getItem('gosafe_jwt_token');
      const user = localStorage.getItem('gosafe_user_info');
      
      setAuthState({
        token: token,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token
      });
    } catch (err) {
      console.error('Error loading auth state:', err);
    }
  }, []);

  const testLogin = async () => {
    if (!userInfo?.id) {
      setTestResult({ success: false, error: 'No user info available' });
      return;
    }

    try {
      const result = await request('/api/auth/login', {
        method: 'POST',
        data: {
          zaloUserId: userInfo.id,
          userInfo: userInfo
        }
      });

      if (result.success) {
        localStorage.setItem('gosafe_jwt_token', result.token);
        localStorage.setItem('gosafe_user_info', JSON.stringify(result.user));
        
        setAuthState({
          token: result.token,
          user: result.user,
          isAuthenticated: true
        });
        
        setTestResult({ success: true, data: result });
      }
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    }
  };

  const testAPI = async () => {
    try {
      const result = await request('/api/test-protected');
      setTestResult({ success: true, data: result });
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    }
  };

  return (
    <Page>
      <PageHeader title="JWT Authentication Test" showBackIcon />
      
      <Box className="p-4 space-y-4">
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-bold mb-2">👤 User Info:</Text>
          <Text size="small">Name: {userInfo?.name || 'N/A'}</Text>
          <Text size="small">ID: {userInfo?.id || 'N/A'}</Text>
        </Box>

        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-bold mb-2">🎫 JWT Status:</Text>
          <Text size="small">Authenticated: {authState.isAuthenticated ? '✅' : '❌'}</Text>
          <Text size="small">Role: {authState.user?.role || 'N/A'}</Text>
          <Text size="small">Token: {authState.token ? '✅ Present' : '❌ Missing'}</Text>
        </Box>

        <Button fullWidth onClick={testLogin} disabled={!userInfo?.id}>
          🔑 Test Login
        </Button>
        
        <Button fullWidth onClick={testAPI} loading={loading} disabled={!authState.isAuthenticated}>
          🛡️ Test Protected API
        </Button>

        {testResult && (
          <Box className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-bold mb-2">📊 Result:</Text>
            <Text size="small" className={testResult.success ? 'text-green-600' : 'text-red-600'}>
              {testResult.success ? '✅ Success' : '❌ Failed'}
            </Text>
            <Text size="small" className="mt-2">
              {testResult.success ? 
                JSON.stringify(testResult.data, null, 2) : 
                testResult.error
              }
            </Text>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default JWTTest;

