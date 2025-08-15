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