import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useEffect } from "react";
import PageHeader from '../../components/PageHeader';

const VehicleManagement = () => {
  const navigate = useNavigate();
  const [vehicles] = useState([]); // Danh sách phương tiện (hiện tại trống)

  // Ngăn scroll khi vào trang này
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      document.body.style.overflow = '';
    };
  }, []);

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
      flexDirection: 'column',
      overflow: 'hidden',
      touchAction: 'none'
    }}>
      {/* Header */}
      <PageHeader title="Quản lý phương tiện" />

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
