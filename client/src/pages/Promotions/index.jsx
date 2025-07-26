import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import BottomNavigation from "../../components/BottomNavigation";
import { MOCK_PROMOTIONS } from "../../constants/promotions";

const Promotions = () => {
  const navigate = useNavigate();
  const [promotions] = useState(MOCK_PROMOTIONS);

  const handlePromotionClick = (promotion) => {
    navigate(`/promotion-detail/${promotion.id}`, { state: { promotion } });
  };

  const handleBack = () => {
    navigate(-1);
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
          Khuyến mãi
        </Text>
        <Box onClick={handleBack} style={{ 
          marginLeft: 'auto',
          cursor: 'pointer'
        }}>
          <Text style={{ fontSize: '20px', color: '#6b7280' }}>✕</Text>
        </Box>
      </Box>

      {/* Promotions List */}
      <Box style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: '90px'
      }}>
        {promotions.map((promotion) => (
          <Box
            key={promotion.id}
            onClick={() => handlePromotionClick(promotion)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* Logo */}
            <Box style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              position: 'relative'
            }}>
              <Text style={{ 
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                G<br/>Safe
              </Text>
            </Box>

            {/* Content */}
            <Box style={{ flex: 1 }}>
              <Text style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {promotion.title}
              </Text>
              <Text style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Từ ngày 24/11/2024 đến ngày {promotion.validUntil}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>

      <BottomNavigation activeTab="account" />
    </Page>
  );
};

export default Promotions;