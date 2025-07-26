import React from "react";
import { Box, Text } from "zmp-ui";

const HistoryItem = ({ trip }) => {
  const getStatusStyle = (status) => {
    if (status === 'completed') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534'
      };
    } else if (status === 'cancelled') {
      return {
        backgroundColor: '#fee2e2',
        color: '#dc2626'
      };
    } else {
      return {
        backgroundColor: '#fef3c7',
        color: '#92400e'
      };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Đang xử lý';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}
    >
      <Box style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <Text style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151'
        }}>
          {trip.type}
        </Text>
        <Text style={{
          fontSize: '12px',
          color: '#6b7280'
        }}>
          {trip.date}
        </Text>
      </Box>
      
      <Box style={{ marginBottom: '12px' }}>
        <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <Box style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            marginRight: '8px'
          }}></Box>
          <Text style={{ fontSize: '14px', color: '#374151', flex: 1 }}>
            {trip.pickup}
          </Text>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Box style={{
            width: '8px',
            height: '8px',
            border: '2px solid #ef4444',
            borderRadius: '50%',
            marginRight: '8px'
          }}></Box>
          <Text style={{ fontSize: '14px', color: '#374151', flex: 1 }}>
            {trip.destination}
          </Text>
        </Box>
      </Box>

      <Box style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#f97316'
        }}>
          {trip.price}
        </Text>
        <Box style={{
          ...getStatusStyle(trip.status),
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {getStatusText(trip.status)}
        </Box>
      </Box>

      {trip.driver && (
        <Box style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px'
        }}>
          <Text style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Tài xế: {trip.driver}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(HistoryItem);
