// UserHeader.js
import { useState } from "react";
import { getPhoneNumber } from "zmp-sdk/apis";

 const URL_SERVER = process.env.URL_SERVER;

const UserHeader = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const requestPhoneNumber = async () => {
    try {
      setLoading(true);
      const res = await getPhoneNumber();
      const code = res.code;

      // Gửi mã code lên server để lấy số điện thoại
      const response = await fetch(URL_SERVER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setPhoneNumber(data.phone); // phone là số đã decode từ server
    } catch (error) {
      console.error("Lỗi khi lấy số điện thoại:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={requestPhoneNumber}>
        {loading ? "Đang xử lý..." : "Lấy số điện thoại"}
      </button>
      {phoneNumber && <p>Số điện thoại: {phoneNumber}</p>}
    </div>
  );
};

export default UserHeader;
