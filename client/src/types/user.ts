export interface User {
  _id: string;
  username: string;
  mobile: string;
  role: string;
  name: string;
  permissions: string[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  otp: string | null;
  otpExpires: string | null;
}

export interface SendOTPResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    mobile: string;
    role: string;
    name: string;
    isAdmin: boolean;
  };
  message: string;
}