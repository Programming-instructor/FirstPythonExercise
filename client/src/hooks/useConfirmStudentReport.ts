import { confirmStudentReport } from '@/services/student';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useConfirmStudentReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => confirmStudentReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-reports'] });
    },
  });
};