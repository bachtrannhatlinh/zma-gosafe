import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import CustomModal from '../CustomModal';

const PermissionModal = ({ 
  visible, 
  onClose, 
  onAccept, 
  isLoading = false 
}) => (
  <CustomModal
    visible={visible}
    onClose={onClose}
    showCloseButton={false}
    position="center"
  >
    <Box className="text-center p-4">
      <Box className="mb-4">
        <Text className="text-2xl mb-2">📱</Text>
        <Text className="text-lg font-bold text-black mb-2">
          Cần số điện thoại để sử dụng GoSafe
        </Text>
      </Box>

      <Box className="text-left mb-6 space-y-3">
        <Text className="text-gray-700 text-sm">
          <strong>Mục đích sử dụng:</strong>
        </Text>
        <Box className="space-y-2 text-sm text-gray-600">
          <Text>• Định danh tài khoản của bạn</Text>
          <Text>• Liên hệ khẩn cấp khi cần thiết</Text>
          <Text>• Xác thực thông tin cá nhân</Text>
          <Text>• Bảo mật và bảo vệ tài khoản</Text>
        </Box>

        <Text className="text-xs text-gray-500 mt-4">
          Số điện thoại của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích trên
        </Text>
      </Box>

      <Box className="flex flex-row gap-2">
        <Button
          fullWidth
          className="custom-btn-outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Đóng
        </Button>
        <Button
          fullWidth
          className="custom-btn-filled"
          onClick={onAccept}
          disabled={isLoading}
        >
          {isLoading ? "🔄 Đang xử lý..." : "Đồng ý cung cấp"}
        </Button>
      </Box>
    </Box>
  </CustomModal>
);

export default PermissionModal;