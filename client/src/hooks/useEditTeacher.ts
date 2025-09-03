import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TeacherFormData } from "@/types/teacher";
import { editTeacher } from "@/services/teacher";

export const useEditTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: Partial<TeacherFormData>; file?: File }) =>
      editTeacher(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('معلم با موفقیت ویرایش شد');
    },
    onError: () => {
      toast.error('خطا در ویرایش معلم');
    },
  });
};