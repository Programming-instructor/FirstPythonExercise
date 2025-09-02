import { addReportToTeacher } from "@/services/teacher";
import { useMutation } from "@tanstack/react-query";

export const useAddReportToTeacher = () => {
  return useMutation({
    mutationFn: addReportToTeacher,
  });
};