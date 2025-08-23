import api from "@/lib/axiosConfig";
import type { LoginResponse, SendOTPResponse } from "@/types/user";

export const fetchUser = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (err) {
    console.error('Error Fetching User: ', err);
  }
};

export const sendOTP = async (mobile: string): Promise<SendOTPResponse> => {
  const response = await api.post('/user/send-otp', { mobile });
  return response.data;
};

export const loginWithOTP = async ({ mobile, otp }: { mobile: string; otp: string }): Promise<LoginResponse> => {
  const response = await api.post('/user/login', { mobile, otp });
  return response.data;
};
