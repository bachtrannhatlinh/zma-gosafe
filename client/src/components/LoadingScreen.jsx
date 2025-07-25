import { Page, Box, Text, Spinner } from "zmp-ui";

const LoadingScreen = ({ compact = false }) => {
  if (compact) {
    // Compact version for PullToRefresh
    return (
      <Box className="flex items-center justify-center py-4">
        <Box className="text-center">
          <Box className="mb-2 flex justify-center">
            <Spinner size="small" className="text-blue-500" />
          </Box>
          <Text className="text-gray-600 text-sm">Đang tải...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Page className="bg-white min-h-screen flex items-center justify-center relative">
      {/* Safe area padding to avoid dynamic island */}
      <Box className="text-center px-6 py-4" style={{ paddingTop: '60px' }}>
        {/* Logo hoặc branding - giảm kích thước 50% */}
        <Box className="mb-4">
          <Box className="w-10 h-10 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Text className="text-white text-lg font-bold">G</Text>
          </Box>
          <Text className="text-lg font-bold text-gray-800 mb-1">GOSafe</Text>
          <Text className="text-xs text-gray-500">Ứng dụng bảo hiểm thông minh</Text>
        </Box>
        
        {/* Loading animation - giảm kích thước */}
        <Box className="mb-4 flex justify-center">
          <Spinner size="medium" className="text-blue-500" />
        </Box>
        
        {/* Loading text - giảm kích thước */}
        <Text className="text-gray-600 text-sm mb-2">Đang tải dữ liệu...</Text>
        
        {/* Loading dots animation - giảm kích thước */}
        <Box className="flex justify-center items-center space-x-1">
          <Box 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></Box>
          <Box 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></Box>
          <Box 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></Box>
        </Box>
      </Box>
    </Page>
  );
};

export default LoadingScreen;
