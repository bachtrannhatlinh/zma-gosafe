import React from "react";
import { Box, Text } from "zmp-ui";

const EmptyState = ({ icon, title, subtitle }) => {
  return (
    <Box className="text-center py-16">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-gray-600 text-lg font-medium mb-2">
        {title}
      </Text>
      <Text className="text-gray-400 text-sm max-w-xs mx-auto">
        {subtitle}
      </Text>
    </Box>
  );
};

export default React.memo(EmptyState);
