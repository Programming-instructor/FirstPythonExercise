import { fetchStudentReports } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentReports = (nCode: string) => {
  return useQuery({
    queryKey: ['fetch-student-reports', nCode],
    queryFn: () => fetchStudentReports(nCode),
  })
}