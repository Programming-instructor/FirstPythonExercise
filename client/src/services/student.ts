import api from "@/lib/axiosConfig";
import type { SendOTPResponse, StudentLoginResponse } from "@/types/user"; // Assuming you will add StudentLoginResponse to types/user.ts
import type { DecisionData } from "@/types/student";

export const postStudentData = async (formData: FormData) => {
  try {
    const res = await api.post('/student', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error('Error posting student: ', error);
  }
};

export const fetchStudents = async (page: number, limit: number, search: string) => {
  try {
    const response = await api.get(`/student?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students: ', error);
  }
};

export const importStudents = async (file: File) => {
  try {
    if (!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.type)) {
      throw new Error("لطفاً یک فایل اکسل معتبر (.xlsx یا .xls) انتخاب کنید");
    }
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/student/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    console.error('Error importing students: ', err);
  }
};

export const exportStudents = async (): Promise<Blob> => {
  const response = await api.get("/student/export", { responseType: "blob" });
  return response.data;
};

export const fetchStudentByNationalCode = async (national_code: string) => {
  try {
    if (!/^\d{10}$/.test(national_code)) {
      throw new Error("کد ملی نامعتبر است");
    }
    const response = await api.get(`/student/${national_code}`);
    return response.data.student;
  } catch (error) {
    console.error('Error fetching student by national code: ', error);
    throw error;
  }
};

export const fetchDecisionsByNationalCode = async (national_code: string): Promise<DecisionData> => {
  try {
    if (!/^\d{10}$/.test(national_code)) {
      throw new Error("کد ملی نامعتبر است");
    }
    const response = await api.get(`/student/evaluation/${national_code}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student by national code: ', error);
    throw error;
  }
};

export const postStudentReport = async (id: string, message: string, date: string) => {
  try {
    const response = await api.post(`/student/report`, { message, date, studentId: id });
    return response.data;
  } catch (error) {
    console.error('Error posting student report: ', error);
    throw error;
  }
};

export const StudentSendOTP = async (student_phone: string): Promise<SendOTPResponse> => {
  const response = await api.post('/student/send-otp', { student_phone });
  return response.data;
};

export const studentLoginWithOTP = async ({ student_phone, otp }: { student_phone: string; otp: string }): Promise<StudentLoginResponse> => {
  const response = await api.post('/student/login', { student_phone, otp });
  return response.data;
};

export const fetchStudent = async () => {
  try {
    const response = await api.get("/student/me");
    return response.data;
  } catch (err) {
    console.error('Error Fetching Student: ', err);
  }
};

export const fetchStudentReports = async (studentId: string) => {
  try {
    const response = await api.get(`/student/reports/${studentId}`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching Student Reports: ', err);
  }
};