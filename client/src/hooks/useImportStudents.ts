import { importStudents } from "@/services/student";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useImportStudents = () => {
  return useMutation({
    mutationFn: importStudents,
    onSuccess: () => {
      toast.success("دانش‌آموزان با موفقیت وارد شدند");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در وارد کردن دانش‌آموزان");
    },
  });
};