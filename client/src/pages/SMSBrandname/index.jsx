import React from "react";
import { Page, Box } from "zmp-ui";
import { openSMS } from "zmp-sdk/apis";
import PhoneInput from '../../components/shared/PhoneInput';
import LoadingButton from '../../components/shared/LoadingButton';
import { useForm } from '../../hooks/useForm';
import { useApi } from '../../hooks/useApi';
import { usePlatformDetection } from '../../hooks/usePlatformDetection';

const SMSBrandname = () => {
  const { request, loading } = useApi();
  const { isRealDevice, isZalo } = usePlatformDetection();

  const validators = {
    phoneNumber: (value) => {
      if (!value?.trim()) return "Vui lòng nhập số điện thoại";
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(value.trim())) return "Số điện thoại không đúng định dạng";
      return null;
    },
    message: (value) => {
      if (!value?.trim()) return "Vui lòng nhập nội dung tin nhắn";
      return null;
    }
  };

  const { values, errors, setValue, validateAll } = useForm({
    phoneNumber: "",
    message: ""
  }, validators);

  const handleSendSMS = async () => {
    if (!validateAll()) return;

    try {
      if (isRealDevice && isZalo) {
        await sendBrandnameSMS();
      } else {
        await sendRegularSMS();
      }
    } catch (error) {
      alert("Gửi SMS thất bại: " + error.message);
    }
  };

  const sendBrandnameSMS = async () => {
    const confirmed = confirm(
      `Gửi SMS Brandname "GoSafe" đến ${values.phoneNumber}?`
    );
    if (!confirmed) return;

    await request('/api/sms/send-brandname', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: values.phoneNumber.trim(),
        message: values.message.trim(),
        brandname: 'GoSafe'
      })
    });

    alert("SMS Brandname đã được gửi thành công!");
  };

  const sendRegularSMS = async () => {
    await new Promise((resolve, reject) => {
      openSMS({
        phoneNumber: values.phoneNumber.trim(),
        content: values.message.trim(),
        success: resolve,
        fail: reject
      });
    });
    alert("Đã mở Messages app!");
  };

  return (
    <Page className="pt-safe-area-top pb-safe-area-bottom">
      <Box className="p-4">
        <PhoneInput
          value={values.phoneNumber}
          onChange={(value) => setValue('phoneNumber', value)}
          error={errors.phoneNumber}
          placeholder="Nhập số điện thoại"
        />
        
        <LoadingButton
          loading={loading}
          onClick={handleSendSMS}
          className="w-full mt-4"
        >
          Gửi SMS
        </LoadingButton>
      </Box>
    </Page>
  );
};

export default SMSBrandname;

