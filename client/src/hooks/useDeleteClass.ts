import { deleteClass } from '@/services/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      toast.success('کلاس با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در حذف کلاس');
    },
  });
};