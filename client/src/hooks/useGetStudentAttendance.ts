import { fetchStudentAttendance } from "@/services/student"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentAttendance = (nCode: string) => {
  return useQuery({
    queryKey: ['fetch-student-attendance', nCode],
    queryFn: () => fetchStudentAttendance(nCode),
  })
}