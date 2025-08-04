import { useUserInfo } from "../contexts/UserContext";
import { STORAGE_KEYS } from "../constants/dashboard";

export const useUserData = () => {
  const { userInfo, isLoading, error, refetchUserInfo } = useUserInfo();
  const userPhone = localStorage.getItem(STORAGE_KEYS.USER_PHONE) || "";

  const getUserData = async () => {
    return await refetchUserInfo();
  };

  const refetch = async () => {
    await getUserData();
  };

  return {
    userInfo,
    userPhone,
    isLoading,
    error,
    getUserData,
    refetch
  };
};
