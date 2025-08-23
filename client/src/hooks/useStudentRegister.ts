import { postStudentData } from "@/services/student";
import type { StudentFormData } from "@/types/student";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";


export const useStudentRegister = (): UseMutationResult<
  void,
  Error,
  { formData: StudentFormData; imageFile: File | null }
> => {
  return useMutation({
    mutationFn: async ({ formData, imageFile }: { formData: StudentFormData; imageFile: File | null }) => {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'guardian') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) {
        data.append('portrait', imageFile);
      }
      await postStudentData(data);
    },
    onSuccess: () => {
      toast.success('هنرجو با موفقیت ثبت شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ثبت هنرجو');
    },
  });
};