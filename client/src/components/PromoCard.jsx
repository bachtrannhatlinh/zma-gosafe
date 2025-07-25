import React from "react";
import { Box, Text } from "zmp-ui";

const PromoCard = ({ promo, onClick }) => {
  const handleClick = () => {
    onClick?.(promo);
  };

  return (
    <Box
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Promo Header with Background */}
      <Box className={`${promo.bgColor} p-4 relative h-32`}>
        <Text className="absolute right-3 top-3 text-2xl">
          {promo.image}
        </Text>
        <Box className="pr-8">
          <Text className="text-white text-sm font-bold mb-1">
            {promo.title}
          </Text>
          <Text className="text-white text-xs">
            {promo.subtitle}
          </Text>
        </Box>
        {promo.discount && (
          <Box className="absolute bottom-2 left-4">
            <Box className="bg-white bg-opacity-20 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">
                {promo.discount}
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Promo Footer */}
      <Box className="p-3 bg-white">
        <Box className="flex items-center justify-between">
          <Text className="text-gray-600 text-xs">
            Có hiệu lực đến:
          </Text>
          <Text className="text-orange-500 text-xs font-medium">
            {promo.validUntil}
          </Text>
        </Box>
        <Box className="mt-2 bg-orange-50 rounded-lg px-3 py-2">
          <Text className="text-orange-600 text-xs font-medium text-center">
            Sử dụng ngay
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(PromoCard);
