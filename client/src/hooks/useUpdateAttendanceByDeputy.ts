import { updateAttendanceByDeputy } from '@/services/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateAttendanceByDeputy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendanceByDeputy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceByDate'] });
    },
  });
};