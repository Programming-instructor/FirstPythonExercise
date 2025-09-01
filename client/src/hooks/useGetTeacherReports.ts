import { fetchTeacherReports } from "@/services/teacher"
import { useQuery } from "@tanstack/react-query"

export const useGetTeacherReports = (teacherId: string) => {
  return useQuery({
    queryKey: ['fetch-teacher-reports', teacherId],
    queryFn: () => fetchTeacherReports(teacherId),
  })
}