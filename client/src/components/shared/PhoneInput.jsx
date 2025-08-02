import React from 'react';
import { Input, Text } from 'zmp-ui';

const PhoneInput = ({ 
  value, 
  onChange, 
  placeholder = "Nhập số điện thoại", 
  error,
  required = false 
}) => {
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.trim());
  };

  const handleChange = (e) => {
    const phone = e.target.value;
    onChange(phone, validatePhone(phone));
  };

  return (
    <>
      <Input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        status={error ? 'error' : 'default'}
        required={required}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </>
  );
};

export default PhoneInput;