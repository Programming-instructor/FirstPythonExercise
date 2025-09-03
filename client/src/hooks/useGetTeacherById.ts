import { useQuery } from "@tanstack/react-query";
import type { FullTeacher } from "@/types/teacher";
import { fetchTeacherById } from "@/services/teacher";

export const useGetTeacherById = (id: string, enabled: boolean = true) => {
  return useQuery<FullTeacher>({
    queryKey: ['teacher', id],
    queryFn: () => fetchTeacherById(id),
    enabled: enabled && !!id,
  });
};