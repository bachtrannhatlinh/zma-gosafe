import React from "react";
import { Box, Text } from "zmp-ui";

const NewsCard = ({ news, onClick }) => {
  return (
    <Box
      onClick={() => onClick(news)}
      className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
      role="button"
      tabIndex={0}
    >
      <Box className="flex space-x-4">
        {/* News Image/Icon */}
        <Box className={`${news.bgColor} rounded-lg w-16 h-16 flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Text className="text-2xl">{news.image}</Text>
        </Box>
        
        {/* News Content */}
        <Box className="flex-1 min-w-0">
          <Box className="flex items-start justify-between mb-2">
            <Text className="font-bold text-gray-800 text-sm line-clamp-2">
              {news.title}
            </Text>
          </Box>
          
          <Text className="text-gray-600 text-xs mb-2 line-clamp-2">
            {news.subtitle}
          </Text>
          
          <Box className="flex items-center justify-between">
            <Text className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {news.category}
            </Text>
            <Text className="text-xs text-gray-500">
              {news.date}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(NewsCard);
