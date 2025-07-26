import React from "react";
import { Box, Text, Input } from "zmp-ui";

const LocationInput = ({ 
  value, 
  onChange, 
  placeholder, 
  iconColor = "green", 
  iconType = "filled" // "filled" or "outlined"
}) => {
  const getIconStyle = () => {
    const baseStyle = {
      width: '12px',
      height: '12px',
      marginTop: '8px',
      marginRight: '12px',
      flexShrink: 0,
      borderRadius: iconType === "filled" ? '50%' : '50%'
    };
    
    if (iconType === "filled") {
      return {
        ...baseStyle,
        backgroundColor: iconColor === "green" ? '#10b981' : '#ef4444'
      };
    } else {
      return {
        ...baseStyle,
        border: `2px solid ${iconColor === "green" ? '#10b981' : '#ef4444'}`,
        backgroundColor: 'transparent'
      };
    }
  };

  return (
    <Box className="bg-white rounded-lg shadow-sm mb-3 p-4">
      <Box className="flex items-start">
        <Box style={getIconStyle()}></Box>
        <Box className="flex-1">
          <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="border-none p-0 text-sm"
            style={{ 
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LocationInput;
