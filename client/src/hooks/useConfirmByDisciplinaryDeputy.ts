import { confirmByDisciplinaryDeputy } from '@/services/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useConfirmByDisciplinaryDeputy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmByDisciplinaryDeputy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceByDate'] });
    },
  });
};