import React, { useState } from "react";
import { Page, Box, Text, Button, Input } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import PageHeader from '../../components/PageHeader';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }

    if (formData.newPassword.length < 6) {
      return;
    }
    
    console.log("Đổi mật khẩu:", formData);
    navigate(-1);
  };

  const isFormValid = formData.currentPassword && formData.newPassword && formData.confirmPassword;

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
      <PageHeader title="Đổi mật khẩu" />

      {/* Form Content */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        {/* Mật khẩu hiện tại */}
        <Box style={{ marginBottom: '20px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Mật khẩu hiện tại <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <Input
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
        </Box>

        {/* Mật khẩu mới */}
        <Box style={{ marginBottom: '20px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '4px'
          }}>
            Mật khẩu mới <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <Text style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            Tối thiểu 6 ký tự
          </Text>
          <Input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
        </Box>

        {/* Xác nhận mật khẩu */}
        <Box style={{ marginBottom: '32px' }}>
          <Text style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Xác nhận mật khẩu mới <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
          disabled={!isFormValid}
          style={{
            width: '100%',
            backgroundColor: isFormValid ? '#f97316' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px',
            cursor: isFormValid ? 'pointer' : 'not-allowed'
          }}
        >
          Đổi mật khẩu
        </Button>
      </Box>
    </Page>
  );
};

export default ChangePassword;
