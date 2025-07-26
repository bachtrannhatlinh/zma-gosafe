import React from "react";
import { Box, Text } from "zmp-ui";

const SectionHeader = ({ title, onViewAll, viewAllText = "Xem tất cả", darkMode = false }) => {
  const textColor = darkMode ? "text-white" : "text-gray-800";
  const linkColor = darkMode ? "text-yellow-300 hover:text-yellow-100" : "text-blue-600 hover:text-blue-800";
  
  return (
    <Box className="flex items-center justify-between mb-4">
      <Text className={`font-bold text-lg ${textColor}`}>{title}</Text>
      {onViewAll && (
        <Box onClick={onViewAll} className="p-0 cursor-pointer">
          <Text className={`text-sm ${linkColor} transition-colors duration-200`}>
            {viewAllText}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(SectionHeader);
