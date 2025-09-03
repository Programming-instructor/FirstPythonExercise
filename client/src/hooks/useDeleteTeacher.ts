import { deleteTeacher } from "@/services/teacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('معلم با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف معلم');
    },
  });
};