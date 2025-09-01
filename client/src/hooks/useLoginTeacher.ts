import { teacherLoginWithOTP } from "@/services/teacher";
import type { TeacherLoginResponse } from "@/types/user";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoginTeacher = (): UseMutationResult<TeacherLoginResponse, Error, { mobile: string; otp: string }> => {
  return useMutation({
    mutationFn: teacherLoginWithOTP,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token); // Store JWT token
      toast.success(data.message || 'ورود با موفقیت انجام شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.');
    },
  });
};