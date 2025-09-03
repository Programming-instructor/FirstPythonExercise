import { fetchStudentReports } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentReports = (studentId: string) => {
  return useQuery({
    queryKey: ['fetch-student-reports', studentId],
    queryFn: () => fetchStudentReports(studentId),
  })
}