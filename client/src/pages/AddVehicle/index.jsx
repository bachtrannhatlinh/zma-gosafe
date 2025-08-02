import React, { useState } from "react";
import { Page, Box, Text, Button, Input, Select } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useEffect } from "react";
import PageHeader from '../../components/PageHeader';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    licensePlate: "",
    color: ""
  });

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

  const vehicleBrands = [
    { value: "honda", title: "Honda" },
    { value: "yamaha", title: "Yamaha" },
    { value: "suzuki", title: "Suzuki" },
    { value: "toyota", title: "Toyota" },
    { value: "hyundai", title: "Hyundai" },
    { value: "kia", title: "Kia" },
    { value: "other", title: "Khác" }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.brand || !formData.licensePlate) {
      return;
    }
    
    console.log("Thêm phương tiện:", formData);
    // Xử lý thêm phương tiện
    navigate(-1);
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
      <PageHeader title="Thêm phương tiện" />

      {/* Form Content */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        {/* Hãng xe */}
        <Box style={{ marginBottom: '20px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Hãng xe <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <Select
            placeholder="Chọn hãng xe"
            value={formData.brand}
            onChange={(value) => handleInputChange('brand', value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px'
            }}
          >
            {vehicleBrands.map(brand => (
              <Select.Option key={brand.value} value={brand.value} title={brand.title} />
            ))}
          </Select>
        </Box>

        {/* Biển số xe */}
        <Box style={{ marginBottom: '20px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '4px'
          }}>
            Biển số xe <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <Text style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            Ví dụ: 12A99999
          </Text>
          <Input
            placeholder="Biển số xe"
            value={formData.licensePlate}
            onChange={(e) => handleInputChange('licensePlate', e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
        </Box>

        {/* Màu xe */}
        <Box style={{ marginBottom: '32px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Màu xe
          </Text>
          <Input
            placeholder="Màu xe"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
        </Box>

        {/* Spacer */}
        <Box style={{ flex: 1 }} />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          style={{
            width: '100%',
            backgroundColor: '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px'
          }}
        >
          Thêm phương tiện
        </Button>
      </Box>
    </Page>
  );
};

export default AddVehicle;
