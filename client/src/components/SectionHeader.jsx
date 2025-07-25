import React from "react";
import { Box, Text } from "zmp-ui";

const SectionHeader = ({ title, onViewAll, viewAllText = "Xem tất cả" }) => {
  return (
    <Box className="flex items-center justify-between mb-4">
      <Text className="font-bold text-lg text-gray-800">{title}</Text>
      {onViewAll && (
        <Box onClick={onViewAll} className="p-0 cursor-pointer">
          <Text className="text-blue-600 text-sm hover:text-blue-800 transition-colors duration-200">
            {viewAllText}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(SectionHeader);
