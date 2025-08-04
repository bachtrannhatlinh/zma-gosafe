import React from "react";
import { Box, Text } from "zmp-ui";

const EmptyState = ({ icon, title, subtitle }) => {
  return (
    <Box style={{
      textAlign: 'center',
      padding: '64px 16px'
    }}>
      <Box style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#f3f4f6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '32px'
      }}>
        {icon}
      </Box>
      <Text style={{
        color: '#6b7280',
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '8px'
      }}>
        {title}
      </Text>
      <Text style={{
        color: '#9ca3af',
        fontSize: '14px',
        maxWidth: '300px',
        margin: '0 auto',
        lineHeight: '1.5'
      }}>
        {subtitle}
      </Text>
    </Box>
  );
};

export default React.memo(EmptyState);
