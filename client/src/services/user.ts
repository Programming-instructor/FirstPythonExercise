import api from "@/lib/axiosConfig";
import type { AddUserData, AddUserResponse, GetAllUsersResponse, LoginResponse, SendOTPResponse } from "@/types/user";

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

export const addUser = async (userData: AddUserData): Promise<AddUserResponse> => {
  try {
    const response = await api.post('/user', userData);
    return response.data;
  } catch (err) {
    console.error('Error Adding User: ', err);
    throw err;
  }
};

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (err) {
    console.error('Error Fetching All Users: ', err);
    throw err;
  }
};