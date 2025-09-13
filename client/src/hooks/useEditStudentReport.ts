import { editStudentReport } from '@/services/student';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditStudentReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, message, date }: { reportId: string; message: string; date: string }) =>
      editStudentReport(reportId, message, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-reports'] });
      queryClient.invalidateQueries({ queryKey: ['all-unconfirmed-reports'] });
    },
  });
};