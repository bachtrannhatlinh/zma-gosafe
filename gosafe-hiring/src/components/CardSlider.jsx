import React from "react";
import { Box, Text } from "zmp-ui";

const CardSlider = ({ items, onItemClick, testId }) => {
  return (
    <Box className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide allow-horizontal-scroll" 
         data-testid={testId}
         style={{ 
           overscrollBehaviorX: 'auto',
           touchAction: 'pan-x pan-y',
           WebkitOverflowScrolling: 'touch'
         }}>
      {items.map((item) => (
        <Box
          key={item.id}
          onClick={() => onItemClick(item.title)}
          className="flex-shrink-0 w-40 bg-white cursor-pointer transform transition-transform duration-200 hover:scale-105"
        >
          <Box
            className={`${item.bgColor} rounded-xl p-4 mb-2 relative h-28 shadow-md hover:shadow-lg transition-shadow duration-200`}
          >
            <Text className="text-white text-xs font-bold mb-1">
              {item.title}
            </Text>
            <Text className="text-white text-xs opacity-90">{item.subtitle}</Text>
            <Text className="absolute right-2 top-2 text-2xl">
              {item.image}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(CardSlider);
