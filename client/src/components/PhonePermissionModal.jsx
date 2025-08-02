import React from "react";
import { Box, Text, Button } from "zmp-ui";
import CustomModal from "./CustomModal";

const PhonePermissionModal = ({
  visible,
  onClose,
  onAgree,
  isGettingPhone,
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
          GOSafe cần số điện thoại của bạn
        </Text>
        <Text className="text-sm text-gray-600">
          Chúng tôi cần thông tin số điện thoại, tên và ảnh đại diện của bạn để định danh tài khoản
        </Text>
      </Box>
      <Box className="flex flex-row gap-2">
        <Button
          fullWidth
          className="custom-btn-outline"
          onClick={onClose}
          disabled={isGettingPhone}
        >
          Đóng
        </Button>
        <Button
          fullWidth
          className="custom-btn-filled"
          onClick={onAgree}
          disabled={isGettingPhone}
        >
          {isGettingPhone ? "🔄 Đang xử lý..." : "Đồng ý cung cấp"}
        </Button>
      </Box>
    </Box>
  </CustomModal>
);

export default PhonePermissionModal;