import React from "react";
import { Box, Text, Button } from "zmp-ui";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Box className="mb-6">
      <Text className="font-bold text-gray-800 mb-3">Danh mục</Text>
      <Box className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="tertiary"
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Box className="flex items-center space-x-1">
              <Text className="text-sm">{category.icon}</Text>
              <Text>{category.label}</Text>
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(CategoryFilter);
