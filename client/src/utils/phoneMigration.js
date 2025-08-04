/**
 * Migration script để dọn dẹp localStorage cũ
 * Chạy một lần khi chuyển từ localStorage sang UserContext
 */
export const migratePhoneDataToUserContext = () => {
  try {
    // Lấy dữ liệu cũ từ localStorage
    const oldPhoneData = {
      userPhone: localStorage.getItem("user_phone"),
      zaloToken: localStorage.getItem("zalo_phone_token"),
    };

    console.log("📦 Migration: Found old phone data:", oldPhoneData);

    // Dữ liệu đã được chuyển sang UserContext
    // Có thể giữ lại localStorage để backward compatibility
    // Hoặc xóa đi nếu muốn clean up hoàn toàn
    
    // Tùy chọn: Xóa dữ liệu cũ (uncomment nếu muốn)
    // localStorage.removeItem("user_phone");
    
    console.log("✅ Migration completed");
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
};

/**
 * Kiểm tra xem có cần migration không
 */
export const shouldMigrate = () => {
  const hasOldData = localStorage.getItem("user_phone");
  return Boolean(hasOldData);
};
