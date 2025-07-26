import React from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate, useLocation } from "zmp-ui";

const PromotionDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const promotion = location.state?.promotion;

  const handleBack = () => {
    navigate(-1);
  };

  if (!promotion) {
    return (
      <Page>
        <Text>Không tìm thấy thông tin khuyến mãi</Text>
      </Page>
    );
  }

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
        padding: '16px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Box onClick={handleBack} style={{ cursor: 'pointer', marginRight: '16px' }}>
          <Text style={{ fontSize: '20px' }}>←</Text>
        </Box>
        <Text style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827'
        }}>
          Chi tiết khuyến mãi
        </Text>
      </Box>

      {/* Content */}
      <Box style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
      }}>
        {/* Logo Section */}
        <Box style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <Box style={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Car illustration */}
            <Box style={{
              width: '120px',
              height: '60px',
              backgroundColor: 'white',
              borderRadius: '30px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: '24px' }}>🚗</Text>
            </Box>
            
            <Text style={{ 
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              GOSafe
            </Text>
          </Box>
        </Box>

        {/* Title */}
        <Text style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#111827',
          textAlign: 'left',
          marginBottom: '20px'
        }}>
          Chuyến đầu tiên 50k
        </Text>

        {/* Description */}
        <Text style={{
          fontSize: '16px',
          color: '#374151',
          lineHeight: '1.6',
          marginBottom: '16px'
        }}>
          Giảm ngay 50.000 cho khách hàng lần đầu sử dụng dịch vụ
        </Text>

        {/* Details */}
        <Box style={{ marginBottom: '16px' }}>
          <Text style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '8px'
          }}>
            - Thời gian khuyến mãi từ ngày 24/11/2024 đến ngày 13/11/2027
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '8px'
          }}>
            - Loại khuyến mãi: Giảm 50.000 vnđ cho mỗi hành trình được áp dụng
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '8px'
          }}>
            - Đối tượng áp dụng: Áp dụng cho tất cả khách hàng
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '8px'
          }}>
            - Điều kiện: Khuyến mãi chung
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            - Số lượt sử dụng cho mỗi khách hàng: 1 lần/khuyến mãi
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default PromotionDetail;