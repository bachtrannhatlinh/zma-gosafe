import React from "react";
import { Box, Text } from "zmp-ui";

const ServiceGrid = ({ services, onServiceClick }) => {
  return (
    <Box className="grid grid-cols-4 gap-4 mb-6">
      {services.map((service) => (
        <Box
          key={service.id}
          onClick={() => onServiceClick(service.id)}
          className="flex flex-col items-center bg-white hover:shadow-md transition-shadow duration-200"
        >
          <Box
            className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 hover:scale-105`}
          >
            <Text className="text-xl">{service.icon}</Text>
          </Box>
          <Text className="text-xs text-gray-700 text-center leading-tight">
            {service.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(ServiceGrid);
