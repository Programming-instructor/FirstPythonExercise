import { fetchStudentById } from "@/services/student";
import { useQuery } from "@tanstack/react-query";

export const useFetchStudentById = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id,
  });
};