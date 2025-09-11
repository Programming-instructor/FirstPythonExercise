import { confirmByPrincipal } from '@/services/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useConfirmByPrincipal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmByPrincipal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceByDate'] });
    },
  });
};