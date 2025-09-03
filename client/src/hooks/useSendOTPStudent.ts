import { StudentSendOTP } from "@/services/student";
import type { SendOTPResponse } from "@/types/user";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendOTPStudent = (): UseMutationResult<SendOTPResponse, Error, string> => {
  return useMutation({
    mutationFn: StudentSendOTP,
    onSuccess: (data) => {
      toast.success(data.message || 'کد با موفقیت ارسال شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
    },
  });
};