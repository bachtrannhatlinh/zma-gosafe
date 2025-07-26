import React from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const VNPayPolicy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Page
      style={{
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
          paddingTop: "calc(12px + env(safe-area-inset-top))",
          backgroundColor: "white",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Box/>

        <Box onClick={handleBack}>
          <Text className="text-sm font-bold">Đóng</Text>
        </Box>
      </Box>

      {/* Content */}
      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        {/* Company Info */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Thanh toán, Ưu đãi và Hoàn tiền
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}
          >
            <Text style={{ fontWeight: "600" }}>Địa chỉ email liên hệ:</Text>{" "}
            gosafe@gmail.com
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}
          >
            <Text style={{ fontWeight: "600" }}>Tên tổ chức:</Text> Gosafe -
            Dịch vụ lái xe hỗ trợ tin trên toàn quốc
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}
          >
            <Text style={{ fontWeight: "600" }}>Địa chỉ:</Text> 71 Ngô Thì
            Hương, P Nai Hiên Đông, Q Sơn Trà, Đà Nẵng
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}
          >
            <Text style={{ fontWeight: "600" }}>Số điện thoại:</Text>{" "}
            0374.180.180
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}
          >
            Khi thanh toán, bạn đồng ý sử dụng phương thức thanh toán hợp lệ.
            Nếu bạn không hài lòng với nội dung, GoSafe sẽ hoàn lại tiền hoặc ưu
            đãi trong 30 ngày cho hầu hết các giao dịch mua nội dung.
          </Text>
        </Box>

        {/* Section 1: Định giá */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            1. Định giá
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.6",
              marginBottom: "12px",
            }}
          >
            Giá bán nội dung trên GOSAFE được xác định dựa trên các điều khoản
            trong Điều khoản. Trong một số trường hợp, giá bán nội dung được
            cung cấp bởi Trọng một số trường hợp, giá bán nội dung được cung cấp
            bởi GOSAFE có thể không hoàn toàn giống với giá được niêm yết trên
            ứng dụng di động hoặc TV của chúng tôi, do có sự khác nhau trong hệ
            thống định giá của nhà cung cấp nên tăng di động và chính sách của
            họ về việc triển khai bán hàng và khuyến mại.
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.6",
              marginBottom: "12px",
            }}
          >
            Chúng tôi thỉnh thoảng sẽ chạy các chương trình khuyến mại và bán
            hàng cho nội dung của chúng tôi, trong đó có thể có giá ưu đãi hoặc
            các điều khoản và điều kiện đặc biệt khác trong một khoảng thời gian
            nhất định. Giá áp dụng cho nội dung sẽ là giá tại thời điểm bạn hoàn
            tất giao dịch mua nội dung (lúc thanh toán). Mọi mức giá được đề
            xuất cho nội dung cụ thể đều có thể khác giữa thời điểm bạn đang
            nhập vào tài khoản của bạn so với giá dành cho người dùng chưa đăng
            ký hoặc chưa đăng nhập, vì một số chương trình khuyến mại của chúng
            tôi chỉ dành cho người dùng mới.
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}
          >
            Nếu bạn đã đăng nhập vào tài khoản của bạn, đơn vị tiền tệ niêm yết
            cho bạn là dựa trên vị trí của bạn khi tạo tài khoản. Nếu bạn chưa
            đăng nhập vào tài khoản, đơn vị tiền tệ cho mức giá sẽ dựa trên quốc
            gia nơi bạn sinh sống. Chúng tôi không cho phép người dùng xem giá
            bằng các đơn vị tiền tệ khác.
          </Text>
        </Box>

        {/* Section 2: Thanh toán */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            2. Thanh toán
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.6",
              marginBottom: "12px",
            }}
          >
            Bạn đồng ý trả phí cho nội dung mà bạn mua và bạn ủy quyền cho chúng
            tôi tính phí vào thẻ ghi nợ hoặc thẻ tín dụng của bạn hoặc xử lý các
            khoản phí đó theo các phương thức thanh toán khác (chẳng hạn như
            PayPal, Boleto, SEPA, ghi nợ trực tiếp hoặc điện tử trên thiết bị di
            động). GOSAFE hợp tác với các nhà cung cấp dịch vụ thanh toán để
            cung cấp cho bạn các phương thức thanh toán thuận tiện nhất ở quốc
            gia của bạn và để bảo mật thông tin thanh toán của bạn. Chúng tôi có
            thể cập nhật phương thức thanh toán của bạn bằng cách sử dụng thông
            tin do nhà cung cấp dịch vụ thanh toán của chúng tôi cung cấp. Vui
            lòng tham khảo Chính sách về quyền riêng tư của chúng tôi để biết
            thêm chi tiết.
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}
          >
            Khi mua hàng, bạn đồng ý không sử dụng phương thức thanh toán không
            hợp lệ hoặc trái phép. Nếu phương thức thanh toán của bạn không
            thành công và bạn vẫn có quyền truy cập vào nội dung đang ghi danh,
            bạn đồng ý thanh toán cho chúng tôi các khoản phí tương ứng trong
            vòng 30 ngày kể từ ngày chúng tôi gửi thông báo. Chúng tôi có toàn
            quyền vô hiệu hóa quyền truy cập vào bất kỳ nội dung nào mà chúng
            tôi chưa nhận được khoản thanh toán đầy đủ.
          </Text>
        </Box>

        {/* VNPAY Section */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}
          >
            • <Text style={{ fontWeight: "600" }}>Chuyển khoản ngân hàng</Text>
          </Text>
          <Text
            style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}
          >
            •{" "}
            <Text style={{ fontWeight: "600" }}>
              Thanh toán trực tuyến qua cổng thanh toán VNPAY
            </Text>
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            Cổng thanh toán VNPAY là giải pháp thanh toán do Công ty Cổ phần
            Giải pháp Thanh toán Việt Nam (VNPAY) phát triển. Khách hàng sử dụng
            thẻ ATM Nội địa, Visa, Master, tính năng QR Pay/VNPAY-QR được tích
            hợp sẵn trên ứng dụng Mobile Banking của các ngân hàng hoặc Ví điện
            tử liên kết để thanh toán các giao dịch và nhập mã giảm giá (nếu
            có).
          </Text>

          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Quét mã VNPAY-QR trên 35+ Ứng dụng Mobile Banking và 15+ Ví điện tử
            liên kết.
          </Text>
        </Box>

        {/* Payment Methods Images */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            40+ Thẻ ATM/nội địa/tài khoản ngân hàng
          </Text>

          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            4 thẻ thanh toán quốc tế
          </Text>

          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {["MasterCard", "VISA", "JCB", "UnionPay"].map((card) => (
              <Box
                key={card}
                style={{
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {card}
              </Box>
            ))}
          </Box>
        </Box>

        {/* VNPAY Methods */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Các phương thức thanh toán qua VNPAY:
          </Text>

          <Box style={{ marginBottom: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Chọn phương thức thanh toán
            </Text>

            <Box style={{ marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                Ứng dụng thanh toán hỗ trợ VNPAY
              </Text>
            </Box>

            <Box style={{ marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                Thẻ nội địa và tài khoản ngân hàng
              </Text>
            </Box>

            <Box style={{ marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                Thẻ thanh toán quốc tế
              </Text>
            </Box>

            <Box style={{ marginBottom: "16px" }}>
              <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                Ví điện tử VNPAY
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Payment Guide */}
        <Box style={{ marginBottom: "24px" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            + Hướng dẫn thanh toán qua "Ứng dụng thanh toán hỗ trợ VNPAY-QR"
          </Text>

          <Text
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Bước 1: Quý khách lựa chọn sản phẩm, dịch vụ và chọn Thanh toán ngay
            hoặc Đặt hàng
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}
          >
            Tại trang thanh toán, vui lòng kiểm tra lại sản phẩm đã đặt, điền
            đầy đủ thông tin người nhận hàng, chọn phương thức giao hàng phù
            hợp.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default VNPayPolicy;
