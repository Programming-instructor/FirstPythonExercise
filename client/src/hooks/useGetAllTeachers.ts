import { fetchAllTeachers } from "@/services/teacher";
import { useQuery } from "@tanstack/react-query";

export const useGetAllTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: fetchAllTeachers,
  });
};