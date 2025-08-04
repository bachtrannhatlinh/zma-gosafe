import React from 'react';
import { Button } from 'zmp-ui';

const LoadingButton = ({ 
  loading, 
  children, 
  onClick, 
  disabled,
  variant = 'primary',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;