import { fetchStudents } from "@/services/student";
import { useQuery } from "@tanstack/react-query";

export const useFetchStudents = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['students', page, search],
    queryFn: () => fetchStudents(page, limit, search),
  });
};