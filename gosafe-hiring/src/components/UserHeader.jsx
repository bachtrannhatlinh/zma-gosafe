import React from "react";
import { Box, Text, Avatar } from "zmp-ui";

const UserHeader = ({ userInfo, isLoading }) => {
  if (isLoading) {
    return (
      <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <Box className="flex items-center space-x-3 py-4">
          {/* Avatar skeleton với animation */}
          <Box className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse relative overflow-hidden">
            <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
          </Box>
          
          <Box className="flex-1">
            {/* Text skeletons với animation */}
            <Box className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
            <Box className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 30px)' }}>
      <Box className="flex items-center justify-between py-4">
        <Box className="flex items-center space-x-3">
          <Avatar src={userInfo?.avatar || ""} size="40" className="bg-white">
            {userInfo?.name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Text className="text-black text-xs">Địa điểm của tôi 📍</Text>
            <Text className="text-black text-sm font-bold">
              Cập nhật vị trí của bạn ngay!
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(UserHeader);
