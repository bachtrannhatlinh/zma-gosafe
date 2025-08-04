import React from "react";
import { Box, Text } from "zmp-ui";

const ServiceSection = ({ title, services, onServiceClick, columns = 3 }) => {
  const gridCols = columns === 3 ? "grid-cols-3" : "grid-cols-2";
  
  return (
    <Box className="px-4 py-6">
      {/* Section Title */}
      <Text className="text-lg font-bold text-white mb-6 text-center">
        {title}
      </Text>
      
      {/* Services Grid */}
      <Box className={`grid ${gridCols} gap-4`}>
        {services.map((service) => (
          <Box
            key={service.id}
            onClick={() => onServiceClick(service.id)}
            className="flex flex-col items-center bg-white bg-opacity-90 p-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-100 transition-all duration-200 cursor-pointer"
          >
            <Box
              className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mb-3 transition-transform duration-200 hover:scale-110 shadow-md`}
            >
              <Text className="text-2xl">{service.icon}</Text>
            </Box>
            <Text className="text-sm text-gray-800 text-center leading-tight font-semibold">
              {service.label}
            </Text>
            {service.description && (
              <Text className="text-xs text-gray-600 text-center mt-1 leading-tight">
                {service.description}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(ServiceSection);
