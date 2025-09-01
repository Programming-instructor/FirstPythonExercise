import { fetchTeacherClasses } from "@/services/teacher"
import { useQuery } from "@tanstack/react-query"

export const useGetTeacherClasses = (teacherId: string) => {
  return useQuery({
    queryKey: ['fetch-teacher-class', teacherId],
    queryFn: () => fetchTeacherClasses(teacherId),
  })
}