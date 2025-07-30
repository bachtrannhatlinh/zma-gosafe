import React from 'react';
import { Box, Text, Avatar } from 'zmp-ui';

const UserInfoDisplay = ({ 
  userInfo, 
  phoneNumber, 
  serverLoading, 
  isGettingPhone, 
  serverError, 
  onClick 
}) => {
  const getGreetingText = () => {
    if (userInfo?.name && phoneNumber !== "Chưa có số điện thoại" && phoneNumber !== "Cần cấp quyền") {
      return `Xin chào, ${userInfo.name} 👋`;
    }
    return "Nhấn để cấp quyền số điện thoại 📱";
  };

  const getWelcomeText = () => {
    if (userInfo?.name && phoneNumber !== "Chưa có số điện thoại" && phoneNumber !== "Cần cấp quyền") {
      return `${phoneNumber} - Chào mừng đến GoSafe!`;
    }
    return "Cung cấp số điện thoại để sử dụng đầy đủ tính năng!";
  };

  const getStatusText = () => {
    if (isGettingPhone) return "🔄 Đang lấy thông tin...";
    if (serverLoading) return "🔄 Đang kết nối server...";
    if (serverError && process.env.NODE_ENV === "development") {
      return `🔧 DEV: ${serverError}`;
    }
    return null;
  };

  const statusText = getStatusText();
  const needsPermission = phoneNumber === "Chưa có số điện thoại" || phoneNumber === "Cần cấp quyền";

  return (
    <Box
      className={`flex items-center space-x-3 rounded-lg p-2 -m-2 transition-colors ${
        needsPermission ? 'cursor-pointer hover:bg-gray-50 border border-orange-200 bg-orange-50' : ''
      }`}
      onClick={needsPermission ? onClick : undefined}
    >
      <Avatar
        src={userInfo?.avatar || ""}
        size="40"
        className="bg-white"
      >
        {userInfo?.name?.charAt(0) || "U"}
      </Avatar>
      
      <Box>
        <Text className={`text-xs ${needsPermission ? 'text-orange-600' : 'text-black'}`}>
          {getGreetingText()}
        </Text>
        <Text className={`text-sm font-bold ${needsPermission ? 'text-orange-700' : 'text-black'}`}>
          {getWelcomeText()}
        </Text>
        {statusText && (
          <Text className={`text-xs mt-1 ${
            statusText.includes('DEV') ? 'text-orange-500' : 'text-blue-500'
          }`}>
            {statusText}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default UserInfoDisplay;
