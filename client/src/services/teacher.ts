import api from "@/lib/axiosConfig";
import type { SendOTPResponse, TeacherLoginResponse } from "@/types/user";
import { toast } from "sonner";
import type { TeacherFormData, FullTeacher } from "@/types/teacher";

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

export const addReportToTeacher = async (data: { teacherId: string; date: string; message: string }) => {
  try {
    const response = await api.post(`/teacher/add-report`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding report to teacher: ', error);
    throw error;
  }
};

export const fetchAllTeachers = async () => {
  try {
    const response = await api.get('/teacher');
    return response.data
  } catch (error: any) {
    console.error('Error fetching All teachers: ', error)
    toast.error('خطا در دریافت معلمان');
  }
};

export const fetchTeacherById = async (id: string): Promise<FullTeacher> => {
  try {
    const response = await api.get(`/teacher/teachers/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching teacher by ID: ', error);
    toast.error('خطا در دریافت اطلاعات معلم');
    throw error;
  }
};

export const editTeacher = async (id: string, data: Partial<TeacherFormData>, file?: File) => {
  try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    }
    if (file) {
      formData.append('teacher_portrait_front', file);
    }
    const response = await api.put(`/teacher/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error editing teacher: ', error);
    toast.error('خطا در ویرایش معلم');
    throw error;
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    const response = await api.delete(`/teacher/teachers/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting teacher: ', error);
    toast.error('خطا در حذف معلم');
    throw error;
  }
};