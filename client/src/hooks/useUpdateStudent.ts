import { updateStudent } from "@/services/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateStudent(id, formData),
    onSuccess: () => {
      toast.success("ویرایش دانش‌آموز با موفقیت انجام شد");
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ویرایش دانش‌آموز");
    },
  });
};