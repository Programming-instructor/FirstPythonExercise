import { studentLoginWithOTP } from "@/services/student";
import type { StudentLoginResponse } from "@/types/user";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoginStudent = (): UseMutationResult<StudentLoginResponse, Error, { student_phone: string; otp: string }> => {
  return useMutation({
    mutationFn: studentLoginWithOTP,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token); // Store JWT token
      toast.success(data.message || 'ورود با موفقیت انجام شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.');
    },
  });
};