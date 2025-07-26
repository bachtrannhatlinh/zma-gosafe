import React from "react";
import { Box, Text } from "zmp-ui";

const MenuItem = ({ 
  icon, 
  title, 
  onClick, 
  hasArrow = true, 
  isDestructive = false,
  showBorder = true 
}) => {
  return (
    <Box
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: showBorder ? '1px solid #f3f4f6' : 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        backgroundColor: 'white'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
      }}
    >
      {/* Icon */}
      <Text style={{ 
        fontSize: '20px', 
        marginRight: '16px',
        width: '24px',
        textAlign: 'center'
      }}>
        {icon}
      </Text>
      
      {/* Title */}
      <Text style={{ 
        flex: 1,
        fontSize: '16px',
        color: isDestructive ? '#ef4444' : '#374151',
        fontWeight: '400'
      }}>
        {title}
      </Text>
      
      {/* Arrow */}
      {hasArrow && (
        <Text style={{ 
          fontSize: '16px',
          color: '#9ca3af',
          marginLeft: '8px'
        }}>
          ›
        </Text>
      )}
    </Box>
  );
};

export default MenuItem;
