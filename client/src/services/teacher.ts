import api from "@/lib/axiosConfig";
import type { SendOTPResponse, TeacherLoginResponse } from "@/types/user";

export const TeacherSendOTP = async (mobile: string): Promise<SendOTPResponse> => {
  const response = await api.post('/teacher/send-otp', { mobile });
  return response.data;
};

export const teacherLoginWithOTP = async ({ mobile, otp }: { mobile: string; otp: string }): Promise<TeacherLoginResponse> => {
  const response = await api.post('/teacher/login', { mobile, otp });
  return response.data;
};

export const fetchTeacher = async () => {
  try {
    const response = await api.get("/teacher/me");
    return response.data;
  } catch (err) {
    console.error('Error Fetching Teacher: ', err);
  }
};

export const fetchTeacherClasses = async (teacherId: string) => {
  try {
    const response = await api.get(`/class/teacher/${teacherId}/classes`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching Teacher: ', err);
  }
};

export const fetchTeacherReports = async (teacherId: string) => {
  try {
    const response = await api.get(`/teacher/reports/${teacherId}`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching Teacher: ', err);
  }
};