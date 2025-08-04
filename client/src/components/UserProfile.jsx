import React from "react";
import { Box, Text } from "zmp-ui";

const UserProfile = ({ userInfo, onEditProfile }) => {
  return (
    <Box style={{
      background: 'linear-gradient(to right, #fb923c, #ef4444)',
      padding: '16px 16px', // Tăng padding từ 12px lên 16px
      paddingTop: 'calc(16px + env(safe-area-inset-top))', // Tăng padding top
      paddingBottom: '20px', // Thêm padding bottom
      color: 'white',
      position: 'relative',
      minHeight: '120px' // Thêm chiều cao tối thiểu
    }}>
      {/* Settings Icon */}
      <Box style={{
        position: 'absolute',
        top: 'calc(16px + env(safe-area-inset-top))',
        right: '16px',
        cursor: 'pointer'
      }}>
        <Text style={{ fontSize: '18px', color: 'white' }}>⚙️</Text>
      </Box>

      {/* User Avatar - Thu gọn */}
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '12px', // Tăng từ 8px lên 12px
        marginTop: '8px' // Tăng từ 4px lên 8px
      }}>
        <Box style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: '24px', color: 'white' }}>👤</Text>
        </Box>
      </Box>

      {/* User Info - Thu gọn */}
      <Box style={{ textAlign: 'center' }}>
        <Text style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '6px' // Tăng từ 4px lên 6px
        }}>
          {userInfo.name}
        </Text>
        <Text style={{
          fontSize: '12px',
          color: 'white',
          opacity: 0.9,
          marginBottom: '4px' // Tăng từ 2px lên 4px
        }}>
          {userInfo.email}
        </Text>
        <Text style={{
          fontSize: '12px',
          color: 'white',
          opacity: 0.9
        }}>
          {userInfo.phone}
        </Text>
      </Box>
    </Box>
  );
};

export default UserProfile;
