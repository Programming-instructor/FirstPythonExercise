import { postStudentReport } from "@/services/student";
import { useMutation } from "@tanstack/react-query";

export const usePostReport = (studentId: string, message: string, date: string, userId: string) => {
  return useMutation({
    mutationFn: () => postStudentReport(studentId, message, date, userId),
    onError: (error) => {
      console.error('Post Student Report Mutation Error:', error);
    },
  });
};