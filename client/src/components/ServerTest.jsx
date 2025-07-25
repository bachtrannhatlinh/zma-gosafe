import React, { useState } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import { useServerAuth } from '../hooks/useServerAuth';

const ServerTest = () => {
  const [results, setResults] = useState([]);
  const { sendTokenToServer, testServerConnection, loading } = useServerAuth();

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { message, type, timestamp }]);
  };

  const handleTestConnection = async () => {
    setResults([]);
    addResult('🔄 Testing server connection...', 'info');
    
    try {
      const result = await testServerConnection();
      addResult(`✅ Server connected: ${result.message}`, 'success');
    } catch (error) {
      addResult(`❌ Connection failed: ${error.message}`, 'error');
    }
  };

  const handleTestToken = async () => {
    addResult('🔄 Testing token send (with mock token)...', 'info');
    
    // Test với mock token
    try {
      const response = await fetch('http://localhost:3001/api/decode-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test_token_mock_' + Date.now() })
      });
      
      addResult(`📡 Response status: ${response.status}`, 'info');
      
      const result = await response.json();
      addResult(`📡 Response data: ${JSON.stringify(result)}`, 'info');
      
      if (response.ok) {
        addResult(`✅ Token processed: ${result.message}`, 'success');
        if (result.phoneNumber) {
          addResult(`📱 Phone returned: ${result.phoneNumber}`, 'success');
        }
      } else {
        addResult(`❌ Token failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Request failed: ${error.message}`, 'error');
    }
  };

  const handleTestRealToken = async () => {
    addResult('🔄 Testing with real Zalo token...', 'info');
    
    try {
      const result = await sendTokenToServer();
      
      if (result.success) {
        addResult(`✅ Real token SUCCESS: ${result.message}`, 'success');
        addResult(`📱 Phone: ${result.phoneNumber}`, 'success');
      } else {
        addResult(`❌ Real token FAILED: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Real token ERROR: ${error.message}`, 'error');
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Box className="p-4 bg-gray-50 m-4 rounded-lg">
      <Text className="text-lg font-bold mb-4">🔧 Server Connection Test</Text>
      
      <Box className="flex gap-2 mb-4">
        <Button 
          size="small" 
          onClick={handleTestConnection}
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          Test Connection
        </Button>
        
        <Button 
          size="small" 
          onClick={handleTestToken}
          disabled={loading}
          className="bg-green-500 text-white"
        >
          Test Mock Token
        </Button>
        
        <Button 
          size="small" 
          onClick={handleTestRealToken}
          disabled={loading}
          className="bg-purple-500 text-white"
        >
          Test Real Token
        </Button>
        
        <Button 
          size="small" 
          onClick={clearResults}
          className="bg-gray-500 text-white"
        >
          Clear
        </Button>
      </Box>

      {loading && (
        <Box className="p-2 bg-blue-100 rounded mb-2">
          <Text className="text-blue-700">🔄 Processing...</Text>
        </Box>
      )}

      <Box className="max-h-64 overflow-y-auto">
        {results.map((result, index) => (
          <Box 
            key={index} 
            className={`p-2 mb-1 rounded text-xs ${
              result.type === 'success' ? 'bg-green-100 text-green-800' :
              result.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            <Text className="font-mono">
              [{result.timestamp}] {result.message}
            </Text>
          </Box>
        ))}
      </Box>
      
      {results.length === 0 && (
        <Box className="p-4 text-center text-gray-500">
          <Text>Click a test button to see results</Text>
        </Box>
      )}
    </Box>
  );
};

export default ServerTest;
