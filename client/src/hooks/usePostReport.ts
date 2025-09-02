import { postStudentReport } from "@/services/student";
import { useMutation } from "@tanstack/react-query";

export const usePostReport = (id: string, message: string, date: string) => {
  return useMutation({
    mutationFn: () => postStudentReport(id, message, date),
    onError: (error) => {
      console.error('Post Student Report Mutation Error:', error);
    },
  });
};