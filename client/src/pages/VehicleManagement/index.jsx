import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const VehicleManagement = () => {
  const navigate = useNavigate();
  const [vehicles] = useState([]); // Danh sách phương tiện (hiện tại trống)

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddVehicle = () => {
    navigate("/add-vehicle");
  };

  return (
    <Page style={{ 
      height: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        backgroundColor: 'white',
        borderBottom: '1px solid #f3f4f6',
        position: 'relative'
      }}>
        <Box
          onClick={handleBack}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            backgroundColor: 'transparent'
          }}
        >
          <Text style={{ fontSize: '20px', color: '#374151' }}>←</Text>
        </Box>
        
        <Text style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827'
        }}>
          Quản lý phương tiện
        </Text>
      </Box>

      {/* Content */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        {vehicles.length === 0 ? (
          // Empty state
          <Box style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Bạn chưa có phương tiện
            </Text>
            
            <Button
              onClick={handleAddVehicle}
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Thêm phương tiện
            </Button>
          </Box>
        ) : (
          // Vehicle list (khi có dữ liệu)
          <Box>
            {/* Danh sách phương tiện sẽ hiển thị ở đây */}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default VehicleManagement;
